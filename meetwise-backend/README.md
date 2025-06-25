# MeetWise Backend

FastAPI backend for MeetWise - a meeting transcription service that uses Whisper-medium running on RunPod.

## Features

- Audio file upload (.wav format)
- Integration with RunPod Whisper-medium server
- CORS support for React frontend
- Modular architecture

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` (if available)
   - Update `RUNPOD_URL` in `.env` with your RunPod server IP
   - Update other settings as needed

3. **Run the server:**
   ```bash
   # Development mode
   python -m app.main
   
   # Or using uvicorn directly
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Health Check
- `GET /` - API status
- `GET /health` - Health check
- `GET /api/v1/meeting/health` - Meeting routes health

### Audio Transcription
- `POST /api/v1/meeting/upload` - Upload .wav file for transcription

#### Upload Request
```bash
curl -X POST "http://localhost:8000/api/v1/meeting/upload" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your-audio-file.wav"
```

#### Upload Response
```json
{
  "success": true,
  "transcript": "This is the transcribed text from the audio file...",
  "filename": "your-audio-file.wav",
  "file_size": 1234567
}
```

## Configuration

Environment variables in `.env`:

- `RUNPOD_URL`: URL of your RunPod Whisper-medium server
- `RUNPOD_TRANSCRIBE_ENDPOINT`: Endpoint for transcription (default: `/transcribe`)
- `HOST`: Server host (default: `0.0.0.0`)
- `PORT`: Server port (default: `8000`)
- `ALLOWED_ORIGINS`: CORS allowed origins (default: `http://localhost:3000`)

## Project Structure

```
meetwise-backend/
├── app/
│   ├── main.py                  # FastAPI app entrypoint
│   ├── routes/
│   │   └── meeting.py           # Audio upload + transcription routes
│   ├── services/
│   │   └── whisper_client.py    # RunPod Whisper integration
│   └── models/                  # Database models (future)
├── requirements.txt
├── .env                         # Configuration
└── README.md
```

## Development

The server runs on `http://localhost:8000` by default. API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Notes

- Only `.wav` files are supported
- Maximum file size: 100MB
- Requires a running RunPod Whisper-medium server
- CORS is configured for `localhost:3000` (React dev server) 