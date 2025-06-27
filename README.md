# MeetWise - AI-Powered Meeting Transcription

MeetWise is a comprehensive web application that transforms meeting recordings into actionable insights using AI-powered transcription and speaker diarization.

## Features

- **Audio Upload**: Upload .wav audio files up to 100MB
- **AI Transcription**: Powered by Whisper-medium for accurate speech-to-text
- **Speaker Diarization**: Automatically identify different speakers
- **Timestamps**: Precise timing for each conversation segment
- **Meeting Management**: Create, organize, and view meeting records
- **Modern UI**: Clean, responsive interface with Bootstrap styling

## Architecture

The application consists of three main components:

1. **Frontend** (React.js) - User interface and meeting management
2. **Backend** (FastAPI) - API server with database integration
3. **RunPod Server** (FastAPI + Whisper) - GPU-powered transcription service

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- RunPod GPU instance with Whisper setup

## Setup Instructions

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### 2. Backend Setup

```bash
cd meetwise-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will run on `http://localhost:8000`

### 3. Database Setup

```bash
cd database

# Install dependencies
npm install

# Set up MongoDB connection
# Make sure MongoDB is running locally or update the connection string
```

### 4. RunPod Server

The RunPod server should already be configured and running. Make sure the URL is correctly set in your backend configuration.

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/meetwise
ALLOWED_ORIGINS=http://localhost:3000
RUNPOD_URL=https://your-runpod-instance.proxy.runpod.net
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## API Endpoints

### Meetings
- `POST /api/v1/meeting/create` - Create a new meeting
- `GET /api/v1/meeting/list` - List all meetings
- `GET /api/v1/meeting/{id}` - Get meeting details
- `POST /api/v1/meeting/upload/{id}` - Upload audio for transcription

## Usage

1. **Create a Meeting**: Click "New Meeting" and fill in the details
2. **Upload Audio**: Select a .wav file and submit
3. **View Results**: Navigate to the meeting detail page to see:
   - Meeting summary with statistics
   - Complete transcript with speaker identification
   - Timestamps for each segment

## File Structure

```
meetwise/
├── src/                    # React frontend
│   ├── components/        # React components
│   │   ├── Home.js       # Landing page
│   │   ├── NewMeeting.js # Meeting creation form
│   │   ├── MeetingDetail.js # Meeting details view
│   │   ├── Sidebar.js    # Navigation sidebar
│   │   └── Navbar.js     # Top navigation
├── meetwise-backend/      # FastAPI backend
│   ├── app/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI app
├── database/             # Database models
│   ├── model/           # Mongoose models
│   └── index.js         # Database connection
└── meetwise-runpod/     # RunPod transcription service
```

## Technologies Used

- **Frontend**: React.js, Bootstrap, React Router
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic
- **Database**: MongoDB with Mongoose models
- **AI**: Whisper-medium for transcription
- **Deployment**: RunPod for GPU processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.
