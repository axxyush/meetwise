from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import os
from datetime import datetime
from bson import ObjectId
from app.services.whisper_client import WhisperClient
from app.main import db
from app.models.meeting import (
    MeetingCreate,
    MeetingResponse,
    MeetingListResponse,
    MeetingSummaryResponse,
    UploadResponse,
    mongo_doc_to_meeting_summary_response,
    mongo_doc_to_meeting_response,
    mongo_doc_to_meeting_list_response
)
import jwt
from pydantic import BaseModel

class MeetingUpdate(BaseModel):
    title: str
    description: str
    transcript: str
    speakerNames: Dict[str, str]

router = APIRouter(prefix="/meeting", tags=["meeting"])

JWT_SECRET = os.getenv("JWT_SECRET", "devsecret")
JWT_ALGO = "HS256"

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload["user_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")



@router.post("/create", response_model=MeetingSummaryResponse)
async def create_meeting(meeting_data: MeetingCreate, user_id: str = Depends(get_current_user)):
    """
    Create a new meeting record
    """
    try:
        meeting_doc = {
            "title": meeting_data.title,
            "description": meeting_data.description,
            "audioFileName": "",
            "audioFileSize": 0,
            "transcript": "",
            "segments": [],
            "speakerCount": 0,
            "status": "pending",
            "userId": ObjectId(user_id),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        result = db.meetings.insert_one(meeting_doc)
        meeting_doc["_id"] = result.inserted_id
        
        # Convert to Pydantic model for response
        meeting_response = mongo_doc_to_meeting_summary_response(meeting_doc)
        return meeting_response
    except Exception as e:
        print(f"Error creating meeting: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while creating meeting"
        )

@router.get("/list", response_model=List[MeetingListResponse])
async def list_meetings(user_id: str = Depends(get_current_user)):
    """
    Get all meetings for the current user
    """
    try:
        cursor = db.meetings.find({
            "userId": ObjectId(user_id)
        }).sort("createdAt", -1)
        meetings = []
        for meeting in cursor:
            # Only include meetings that have a valid userId
            if "userId" in meeting and meeting["userId"] == ObjectId(user_id):
                meeting_response = mongo_doc_to_meeting_list_response(meeting)
                meetings.append(meeting_response)
        return meetings
    except Exception as e:
        print(f"Error listing meetings: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while listing meetings"
        )

@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: str, user_id: str = Depends(get_current_user)):
    """
    Get a specific meeting by ID
    """
    try:
        meeting = db.meetings.find_one({
            "_id": ObjectId(meeting_id),
            "userId": ObjectId(user_id)
        })
        if not meeting:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found"
            )
        
        # Convert to Pydantic model for response
        meeting_response = mongo_doc_to_meeting_response(meeting)
        return meeting_response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting meeting: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while getting meeting"
        )

@router.post("/upload/{meeting_id}", response_model=UploadResponse)
async def upload_audio(
    meeting_id: str,
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """
    Upload a .wav audio file for transcription with speaker diarization
    """
    # Validate file type
    if not file.filename.lower().endswith('.wav'):
        raise HTTPException(
            status_code=400, 
            detail="Only .wav files are supported"
        )
    # Validate file size (e.g., max 100MB)
    max_size = 100 * 1024 * 1024  # 100MB
    if file.size and file.size > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 100MB"
        )
    try:
        # Check if meeting exists and belongs to user
        meeting = db.meetings.find_one({
            "_id": ObjectId(meeting_id),
            "userId": ObjectId(user_id)
        })
        if not meeting:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found"
            )
        # Read file content
        audio_content = await file.read()
        # Update meeting status to processing
        db.meetings.update_one(
            {"_id": ObjectId(meeting_id)},
            {
                "$set": {
                    "status": "processing",
                    "audioFileName": file.filename,
                    "audioFileSize": len(audio_content),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        # Initialize Whisper client
        whisper_client = WhisperClient()
        # Transcribe audio with speaker diarization
        result = await whisper_client.transcribe_audio_bytes(
            audio_content, 
            file.filename
        )
        if result is None:
            # Update meeting status to failed
            db.meetings.update_one(
                {"_id": ObjectId(meeting_id)},
                {
                    "$set": {
                        "status": "failed",
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
            raise HTTPException(
                status_code=500,
                detail="Failed to transcribe audio. Please check if the RunPod server is running."
            )
        # Extract transcript and segments from result
        transcript = result.get("transcript", "")
        segments = result.get("segments", [])
        speaker_count = len(set(seg.get("speaker", "") for seg in segments if seg.get("speaker") != "UNKNOWN"))
        # Update meeting with transcription results
        db.meetings.update_one(
            {"_id": ObjectId(meeting_id)},
            {
                "$set": {
                    "transcript": transcript,
                    "segments": segments,
                    "speakerCount": speaker_count,
                    "status": "completed",
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        return UploadResponse(
            success=True,
            transcript=transcript,
            segments=segments,
            filename=file.filename,
            file_size=len(audio_content),
            speaker_count=speaker_count,
            meeting_id=meeting_id
        )
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Error processing upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while processing audio file"
        )
    
@router.put("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(
    meeting_id: str,
    update: MeetingUpdate,
    user_id: str = Depends(get_current_user)
):
    # 1) fetch the existing meeting
    meeting =  db.meetings.find_one({
        "_id": ObjectId(meeting_id),
        "userId": ObjectId(user_id)
    })
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # 2) remap its segments according to speakerNames
    new_segments = []
    for seg in meeting.get("segments", []):
        orig = seg.get("speaker")
        new_seg = {**seg, "speaker": update.speakerNames.get(orig, orig)}
        new_segments.append(new_seg)

    # 3) update the document
    db.meetings.update_one(
        {"_id": ObjectId(meeting_id)},
        {"$set": {
            "title": update.title,
            "description": update.description,
            "transcript": update.transcript,
            "segments": new_segments,
            "updatedAt": datetime.utcnow()
        }}
    )

    # 4) return the updated meeting
    updated =  db.meetings.find_one({"_id": ObjectId(meeting_id)})
    return mongo_doc_to_meeting_response(updated)

@router.get("/health")
async def meeting_health():
    """Health check endpoint for meeting routes"""
    return {"status": "healthy", "service": "meeting-routes"} 