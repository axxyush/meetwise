from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import aiofiles
import tempfile
import os
from typing import Optional, Dict, Any
from app.services.whisper_client import WhisperClient

router = APIRouter(prefix="/meeting", tags=["meeting"])

@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    """
    Upload a .wav audio file for transcription with speaker diarization
    
    Args:
        file: Audio file (.wav format)
        
    Returns:
        JSON response with transcript and speaker segments
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
        # Read file content
        audio_content = await file.read()
        
        # Initialize Whisper client
        whisper_client = WhisperClient()
        
        # Transcribe audio with speaker diarization
        result = await whisper_client.transcribe_audio_bytes(
            audio_content, 
            file.filename
        )
        
        if result is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to transcribe audio. Please check if the RunPod server is running."
            )
        
        # Extract transcript and segments from result
        transcript = result.get("transcript", "")
        segments = result.get("segments", [])
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "transcript": transcript,
                "segments": segments,
                "filename": file.filename,
                "file_size": len(audio_content),
                "speaker_count": len(set(seg.get("speaker", "") for seg in segments if seg.get("speaker") != "UNKNOWN"))
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