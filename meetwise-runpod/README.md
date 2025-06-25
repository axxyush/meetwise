# MeetWise RunPod Inference Server

FastAPI server running on RunPod that combines Whisper-medium transcription with Pyannote speaker diarization.

## Features

- **Whisper-medium** for high-quality audio transcription
- **Pyannote.audio** for speaker diarization
- **FastAPI** endpoint that returns combined results
- **Parallel processing** for faster inference
- **GPU acceleration** (when deployed on RunPod)

## API Endpoint

### POST `/transcribe`

Upload a `.wav` audio file and get transcription with speaker diarization.

**Request:**
```bash
curl -X POST "http://your-runpod-ip:8000/transcribe" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@meeting-recording.wav"
```

**Response:**
```json
{
  "transcript": "Here is the full transcript of the meeting...",
  "segments": [
    {
      "speaker": "SPEAKER_1",
      "text": "Hi, welcome to the meeting.",
      "start": 0.0,
      "end": 2.5
    },
    {
      "speaker": "SPEAKER_2", 
      "text": "Thanks! Let's begin with the agenda.",
      "start": 2.8,
      "end": 6.2
    }
  ]
}
```

## Setup on RunPod

### 1. Create RunPod Template

Create a new pod template with:
- **Container**: `nvidia/cuda:11.8.0-devel-ubuntu22.04`
- **GPU**: RTX 4090 or better (for Pyannote)
- **RAM**: 16GB+ recommended
- **Storage**: 50GB+ for models

### 2. Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Python and pip
apt install -y python3 python3-pip python3-venv

# Install system dependencies for audio processing
apt install -y ffmpeg libsndfile1-dev

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Set Up HuggingFace Token

You need a HuggingFace token to use Pyannote.audio:

1. Go to [HuggingFace](https://huggingface.co/pyannote/speaker-diarization-3.1)
2. Accept the model terms
3. Create an access token at [HuggingFace Settings](https://huggingface.co/settings/tokens)
4. Set environment variable:

```bash
export HF_TOKEN=your_huggingface_token_here
```

### 4. Run the Server

```bash
# Activate virtual environment
source venv/bin/activate

# Run the server
python -m app.main
```

The server will be available at `http://your-runpod-ip:8000`

## Environment Variables

- `HF_TOKEN`: HuggingFace access token for Pyannote.audio
- `CUDA_VISIBLE_DEVICES`: GPU device selection (optional)

## Model Loading

The server loads models asynchronously on startup:
- **Whisper-medium**: ~1.5GB, loads in ~30 seconds
- **Pyannote.audio**: ~2GB, loads in ~60 seconds

Check `/health` endpoint to verify models are loaded.

## Performance

- **Transcription**: ~1-2x real-time on RTX 4090
- **Diarization**: ~0.5-1x real-time on RTX 4090
- **Combined**: ~0.3-0.5x real-time (parallel processing)

## Troubleshooting

### Pyannote Not Loading
- Ensure `HF_TOKEN` is set correctly
- Accept model terms on HuggingFace
- Check internet connectivity

### CUDA Out of Memory
- Reduce batch size in Pyannote pipeline
- Use smaller Whisper model (base instead of medium)
- Increase GPU memory allocation

### Audio Format Issues
- Ensure audio is in WAV format
- Check sample rate (16kHz recommended)
- Verify audio file integrity

## Integration with Main Backend

Update your main backend's `.env`:
```
RUNPOD_URL=http://your-runpod-ip:8000
RUNPOD_TRANSCRIBE_ENDPOINT=/transcribe
```

The main backend will now receive speaker-segmented transcripts! 