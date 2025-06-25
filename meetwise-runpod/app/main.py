from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os
from typing import List, Dict, Any
import logging

from app.services.transcription_service import TranscriptionService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="MeetWise RunPod Inference Server",
    description="Whisper + Pyannote Audio Transcription & Speaker Diarization",
    version="1.0.0"
)

# Initialize transcription service
transcription_service = TranscriptionService()

@app.get("/")
async def root():
    return {
        "message": "MeetWise RunPod Inference Server",
        "status": "running",
        "endpoints": {
            "transcribe": "/transcribe",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "meetwise-runpod-inference",
        "models_loaded": {
            "whisper": transcription_service.whisper_model is not None,
            "pyannote": transcription_service.pyannote_pipeline is not None
        }
    }

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file with speaker diarization
    
    Args:
        file: Audio file (.wav format)
        
    Returns:
        JSON with transcript and speaker segments
    """
    # Validate file type
    if not file.filename.lower().endswith('.wav'):
        raise HTTPException(
            status_code=400,
            detail="Only .wav files are supported"
        )
    
    # Validate file size (max 500MB for RunPod)
    max_size = 500 * 1024 * 1024  # 500MB
    if file.size and file.size > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 500MB"
        )
    
    try:
        logger.info(f"Processing audio file: {file.filename}")
        
        # Read file content
        audio_content = await file.read()
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(audio_content)
            temp_file_path = temp_file.name
        
        try:
            # Process audio with transcription service
            result = await transcription_service.process_audio(temp_file_path)
            
            logger.info(f"Successfully processed {file.filename}")
            
            return JSONResponse(
                status_code=200,
                content=result
            )
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing audio: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False  # Disable reload in production
    ) 