#!/bin/bash

# MeetWise RunPod Inference Server Startup Script

echo "🚀 Starting MeetWise RunPod Inference Server..."

# Check if HF_TOKEN is set
if [ -z "$HF_TOKEN" ]; then
    echo "⚠️  Warning: HF_TOKEN not set. Pyannote diarization will be disabled."
    echo "   To enable speaker diarization:"
    echo "   1. Get token from https://huggingface.co/settings/tokens"
    echo "   2. Accept terms at https://huggingface.co/pyannote/speaker-diarization-3.1"
    echo "   3. Set HF_TOKEN environment variable"
fi

# Activate virtual environment
source venv/bin/activate

# Check GPU availability
if command -v nvidia-smi &> /dev/null; then
    echo "✅ GPU detected:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits
else
    echo "⚠️  No GPU detected. Performance may be slow."
fi

# Start the server
echo "🌐 Starting FastAPI server on port 8000..."
python -m app.main 