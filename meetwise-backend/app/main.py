from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="MeetWise Backend",
    description="Backend API for MeetWise - Meeting Transcription Service",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routes
from app.routes import meeting

app.include_router(meeting.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "MeetWise Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "meetwise-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True
    ) 