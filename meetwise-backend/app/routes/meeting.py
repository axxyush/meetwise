from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import aiofiles
import tempfile
import os
from datetime import datetime
from bson import ObjectId
from app.services.whisper_client import WhisperClient
from app.main import db

router = APIRouter(prefix="/meeting", tags=["meeting"])

# Pydantic models for request/response
class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = ""

class MeetingResponse(BaseModel):
    id: str
    title: str
    description: str
    audioFileName: str
    audioFileSize: int
    transcript: str
    segments: List[Dict[str, Any]]
    speakerCount: int
    status: str
    createdAt: datetime
    updatedAt: datetime

@router.post("/create")
async def create_meeting(meeting_data: MeetingCreate):
    """
    Create a new meeting record
    """
    try:
        # For now, we'll use a default user ID. In a real app, this would come from authentication
        user_id = ObjectId("507f1f77bcf86cd799439011")  # Default user ID
        
        meeting_doc = {
            "title": meeting_data.title,
            "description": meeting_data.description,
            "audioFileName": "",
            "audioFileSize": 0,
            "transcript": "",
            "segments": [],
            "speakerCount": 0,
            "status": "pending",
            "userId": user_id,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await db.meetings.insert_one(meeting_doc)
        meeting_doc["_id"] = result.inserted_id
        
        return JSONResponse(
            status_code=201,
            content={
                "success": True,
                "meeting": {
                    "id": str(meeting_doc["_id"]),
                    "title": meeting_doc["title"],
                    "description": meeting_doc["description"],
                    "status": meeting_doc["status"],
                    "createdAt": meeting_doc["createdAt"].isoformat(),
                    "updatedAt": meeting_doc["updatedAt"].isoformat()
                }
            }
        )
        
    except Exception as e:
        print(f"Error creating meeting: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while creating meeting"
        )

@router.get("/list")
async def list_meetings():
    """
    Get all meetings for the current user
    """
    try:
        # For now, we'll use a default user ID. In a real app, this would come from authentication
        user_id = ObjectId("507f1f77bcf86cd799439011")  # Default user ID
        
        cursor = db.meetings.find({"userId": user_id}).sort("createdAt", -1)
        meetings = []
        
        async for meeting in cursor:
            meetings.append({
                "id": str(meeting["_id"]),
                "title": meeting["title"],
                "description": meeting["description"],
                "audioFileName": meeting["audioFileName"],
                "audioFileSize": meeting["audioFileSize"],
                "status": meeting["status"],
                "speakerCount": meeting["speakerCount"],
                "createdAt": meeting["createdAt"].isoformat(),
                "updatedAt": meeting["updatedAt"].isoformat()
            })
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "meetings": meetings
            }
        )
        
    except Exception as e:
        print(f"Error listing meetings: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while listing meetings"
        )

@router.get("/{meeting_id}")
async def get_meeting(meeting_id: str):
    """
    Get a specific meeting by ID
    """
    try:
        # For now, we'll use a default user ID. In a real app, this would come from authentication
        user_id = ObjectId("507f1f77bcf86cd799439011")  # Default user ID
        
        meeting = await db.meetings.find_one({
            "_id": ObjectId(meeting_id),
            "userId": user_id
        })
        
        if not meeting:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found"
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "meeting": {
                    "id": str(meeting["_id"]),
                    "title": meeting["title"],
                    "description": meeting["description"],
                    "audioFileName": meeting["audioFileName"],
                    "audioFileSize": meeting["audioFileSize"],
                    "transcript": meeting["transcript"],
                    "segments": meeting["segments"],
                    "speakerCount": meeting["speakerCount"],
                    "status": meeting["status"],
                    "createdAt": meeting["createdAt"].isoformat(),
                    "updatedAt": meeting["updatedAt"].isoformat()
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting meeting: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while getting meeting"
        )

@router.post("/upload/{meeting_id}")
async def upload_audio(meeting_id: str, file: UploadFile = File(...)):
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
        # For now, we'll use a default user ID. In a real app, this would come from authentication
        user_id = ObjectId("507f1f77bcf86cd799439011")  # Default user ID
        
        # Check if meeting exists and belongs to user
        meeting = await db.meetings.find_one({
            "_id": ObjectId(meeting_id),
            "userId": user_id
        })
        
        if not meeting:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found"
            )
        
        # Read file content
        audio_content = await file.read()
        
        # Update meeting status to processing
        await db.meetings.update_one(
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
            await db.meetings.update_one(
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
        await db.meetings.update_one(
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
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "transcript": transcript,
                "segments": segments,
                "filename": file.filename,
                "file_size": len(audio_content),
                "speaker_count": speaker_count,
                "meeting_id": meeting_id
            }
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

@router.get("/health")
async def meeting_health():
    """Health check endpoint for meeting routes"""
    return {"status": "healthy", "service": "meeting-routes"} 