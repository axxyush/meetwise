import httpx
import tempfile
import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class WhisperClient:
    def __init__(self):
        self.runpod_url = os.getenv("RUNPOD_URL", "http://your-runpod-ip:8000")
        self.transcribe_endpoint = os.getenv("RUNPOD_TRANSCRIBE_ENDPOINT", "/transcribe")
        self.full_url = f"{self.runpod_url}{self.transcribe_endpoint}"
    
    async def transcribe_with_runpod(self, audio_file_path: str) -> Optional[Dict[str, Any]]:
        """
        Send audio file to RunPod Whisper-medium server for transcription with speaker diarization
        
        Args:
            audio_file_path: Path to the temporary audio file
            
        Returns:
            Dictionary with transcript and speaker segments, or None if failed
        """
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:  # 5 minute timeout
                with open(audio_file_path, "rb") as f:
                    files = {"file": ("audio.wav", f, "audio/wav")}
                    
                    response = await client.post(
                        self.full_url,
                        files=files
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        return result
                    else:
                        print(f"Error from RunPod server: {response.status_code} - {response.text}")
                        return None
                        
        except Exception as e:
            print(f"Error communicating with RunPod server: {str(e)}")
            return None
    
    async def transcribe_audio_bytes(self, audio_bytes: bytes, filename: str = "audio.wav") -> Optional[Dict[str, Any]]:
        """
        Transcribe audio bytes by saving to temp file first
        
        Args:
            audio_bytes: Audio file bytes
            filename: Name for the temporary file
            
        Returns:
            Dictionary with transcript and speaker segments, or None if failed
        """
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name
            
            # Transcribe the temporary file
            result = await self.transcribe_with_runpod(temp_file_path)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
            
            return result
            
        except Exception as e:
            print(f"Error processing audio bytes: {str(e)}")
            return None 