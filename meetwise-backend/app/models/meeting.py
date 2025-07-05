from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId

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

class MeetingListResponse(BaseModel):
    id: str
    title: str
    description: str
    audioFileName: str
    audioFileSize: int
    status: str
    speakerCount: int
    createdAt: datetime
    updatedAt: datetime

class MeetingSummaryResponse(BaseModel):
    id: str
    title: str
    description: str
    status: str
    createdAt: datetime
    updatedAt: datetime

class UploadResponse(BaseModel):
    success: bool
    transcript: str
    segments: List[Dict[str, Any]]
    filename: str
    file_size: int
    speaker_count: int
    meeting_id: str

# Utility functions to convert MongoDB documents to Pydantic models
def mongo_doc_to_meeting_response(mongo_doc: Dict[str, Any]) -> MeetingResponse:
    """Convert MongoDB document to MeetingResponse model"""
    return MeetingResponse(
        id=str(mongo_doc["_id"]),
        title=mongo_doc["title"],
        description=mongo_doc["description"],
        audioFileName=mongo_doc["audioFileName"],
        audioFileSize=mongo_doc["audioFileSize"],
        transcript=mongo_doc["transcript"],
        segments=mongo_doc["segments"],
        speakerCount=mongo_doc["speakerCount"],
        status=mongo_doc["status"],
        createdAt=mongo_doc["createdAt"],
        updatedAt=mongo_doc["updatedAt"]
    )

def mongo_doc_to_meeting_list_response(mongo_doc: Dict[str, Any]) -> MeetingListResponse:
    """Convert MongoDB document to MeetingListResponse model"""
    return MeetingListResponse(
        id=str(mongo_doc["_id"]),
        title=mongo_doc["title"],
        description=mongo_doc["description"],
        audioFileName=mongo_doc["audioFileName"],
        audioFileSize=mongo_doc["audioFileSize"],
        status=mongo_doc["status"],
        speakerCount=mongo_doc["speakerCount"],
        createdAt=mongo_doc["createdAt"],
        updatedAt=mongo_doc["updatedAt"]
    )

def mongo_doc_to_meeting_summary_response(mongo_doc: Dict[str, Any]) -> MeetingSummaryResponse:
    """Convert MongoDB document to MeetingSummaryResponse model"""
    return MeetingSummaryResponse(
        id=str(mongo_doc["_id"]),
        title=mongo_doc["title"],
        description=mongo_doc["description"],
        status=mongo_doc["status"],
        createdAt=mongo_doc["createdAt"],
        updatedAt=mongo_doc["updatedAt"]
    ) 