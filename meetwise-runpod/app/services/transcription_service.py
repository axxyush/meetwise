import asyncio
import whisper
import torch
import numpy as np
import soundfile as sf
from pyannote.audio import Pipeline
from pyannote.audio.pipelines.utils.hook import ProgressHook
from typing import List, Dict, Any, Optional
import logging
import os
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

class TranscriptionService:
    def __init__(self):
        """Initialize Whisper and Pyannote models with RTX 4000 optimizations"""
        self.whisper_model = None
        self.pyannote_pipeline = None
        self.executor = ThreadPoolExecutor(max_workers=2)
        
        # RTX 4000 optimizations
        self._setup_gpu_optimizations()
        
        # Load models asynchronously
        asyncio.create_task(self._load_models())
    
    def _setup_gpu_optimizations(self):
        """Setup GPU optimizations for RTX 4000"""
        if torch.cuda.is_available():
            # Clear GPU cache
            torch.cuda.empty_cache()
            
            # Set memory fraction to prevent OOM
            torch.cuda.set_per_process_memory_fraction(0.8)
            
            # Enable memory efficient attention if available
            if hasattr(torch, 'backends') and hasattr(torch.backends, 'cuda'):
                torch.backends.cuda.enable_flash_sdp(True)
            
            logger.info(f"GPU detected: {torch.cuda.get_device_name(0)}")
            logger.info(f"GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f}GB")
        else:
            logger.warning("No GPU detected. Using CPU (will be very slow).")
    
    async def _load_models(self):
        """Load Whisper and Pyannote models in background with RTX 4000 optimizations"""
        try:
            logger.info("Loading Whisper model...")
            # Use medium model - good balance for RTX 4000
            self.whisper_model = whisper.load_model("medium")
            
            # Move to GPU if available
            if torch.cuda.is_available():
                self.whisper_model = self.whisper_model.cuda()
            
            logger.info("Whisper model loaded successfully")
            
            logger.info("Loading Pyannote pipeline...")
            # You'll need to get a HuggingFace token for pyannote/speaker-diarization-3.1
            # Set it as environment variable: HF_TOKEN=your_token_here
            hf_token = os.getenv("HF_TOKEN")
            if not hf_token:
                logger.warning("HF_TOKEN not set. Pyannote diarization will be disabled.")
                return
                
            self.pyannote_pipeline = Pipeline.from_pretrained(
                "pyannote/speaker-diarization-3.1",
                use_auth_token=hf_token
            )
            
            # RTX 4000 specific optimizations for Pyannote
            if torch.cuda.is_available():
                # Use smaller batch size for RTX 4000
                self.pyannote_pipeline.instantiate({
                    "clustering": {
                        "method": "centroid",
                        "min_clusters": 1,
                        "max_clusters": 10
                    },
                    "segmentation": {
                        "min_duration_off": 0.5,
                        "threshold": 0.5
                    }
                })
            
            logger.info("Pyannote pipeline loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
    
    async def process_audio(self, audio_path: str) -> Dict[str, Any]:
        """
        Process audio file with Whisper transcription and Pyannote diarization
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Dictionary with transcript and speaker segments
        """
        try:
            # Clear GPU memory before processing
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            # Run transcription and diarization in parallel
            transcription_task = asyncio.create_task(self._transcribe_audio(audio_path))
            diarization_task = asyncio.create_task(self._diarize_audio(audio_path))
            
            # Wait for both to complete
            transcript_result, diarization_result = await asyncio.gather(
                transcription_task, 
                diarization_task,
                return_exceptions=True
            )
            
            # Handle exceptions
            if isinstance(transcript_result, Exception):
                logger.error(f"Transcription failed: {transcript_result}")
                raise transcript_result
                
            if isinstance(diarization_result, Exception):
                logger.warning(f"Diarization failed: {diarization_result}")
                diarization_result = None
            
            # Combine results
            result = self._combine_results(transcript_result, diarization_result)
            
            # Clear GPU memory after processing
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing audio: {str(e)}")
            raise
    
    async def _transcribe_audio(self, audio_path: str) -> Dict[str, Any]:
        """Transcribe audio using Whisper with RTX 4000 optimizations"""
        def _transcribe():
            if self.whisper_model is None:
                raise Exception("Whisper model not loaded")
            
            result = self.whisper_model.transcribe(
                audio_path,
                verbose=False,
                language=None,  # Auto-detect
                task="transcribe",
                fp16=torch.cuda.is_available()  # Use FP16 for RTX 4000
            )
            return result
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _transcribe)
    
    async def _diarize_audio(self, audio_path: str) -> Optional[Any]:
        """Perform speaker diarization using Pyannote with RTX 4000 optimizations"""
        def _diarize():
            if self.pyannote_pipeline is None:
                return None
            
            with ProgressHook() as hook:
                diarization = self.pyannote_pipeline(audio_path, hook=hook)
            return diarization
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _diarize)
    
    def _combine_results(self, whisper_result: Dict[str, Any], diarization_result: Any) -> Dict[str, Any]:
        """
        Combine Whisper transcription with Pyannote diarization
        
        Args:
            whisper_result: Whisper transcription result
            diarization_result: Pyannote diarization result
            
        Returns:
            Combined result with transcript and speaker segments
        """
        # Get full transcript
        full_transcript = whisper_result.get("text", "").strip()
        
        # Initialize result
        result = {
            "transcript": full_transcript,
            "segments": []
        }
        
        # If diarization failed, return just the transcript
        if diarization_result is None:
            return result
        
        # Get Whisper segments with timestamps
        whisper_segments = whisper_result.get("segments", [])
        
        # Get Pyannote speaker segments
        speaker_segments = []
        for turn, _, speaker in diarization_result.itertracks(yield_label=True):
            speaker_segments.append({
                "start": turn.start,
                "end": turn.end,
                "speaker": speaker
            })
        
        # Combine Whisper segments with speaker information
        combined_segments = []
        
        for whisper_seg in whisper_segments:
            seg_start = whisper_seg["start"]
            seg_end = whisper_seg["end"]
            seg_text = whisper_seg["text"].strip()
            
            # Find which speaker was talking during this segment
            speaker = self._find_speaker_for_segment(
                seg_start, seg_end, speaker_segments
            )
            
            combined_segments.append({
                "speaker": speaker,
                "text": seg_text,
                "start": seg_start,
                "end": seg_end
            })
        
        result["segments"] = combined_segments
        return result
    
    def _find_speaker_for_segment(self, seg_start: float, seg_end: float, speaker_segments: List[Dict]) -> str:
        """
        Find which speaker was talking during a given time segment
        
        Args:
            seg_start: Start time of the segment
            seg_end: End time of the segment
            speaker_segments: List of speaker segments from Pyannote
            
        Returns:
            Speaker label (e.g., "SPEAKER_1")
        """
        # Find the speaker segment that overlaps most with the text segment
        max_overlap = 0
        best_speaker = "UNKNOWN"
        
        for speaker_seg in speaker_segments:
            # Calculate overlap
            overlap_start = max(seg_start, speaker_seg["start"])
            overlap_end = min(seg_end, speaker_seg["end"])
            
            if overlap_end > overlap_start:
                overlap_duration = overlap_end - overlap_start
                if overlap_duration > max_overlap:
                    max_overlap = overlap_duration
                    best_speaker = speaker_seg["speaker"]
        
        return best_speaker 