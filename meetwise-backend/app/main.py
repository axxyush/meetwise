from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import pymongo
from datetime import datetime

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

# Database connection
MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = pymongo.MongoClient(MONGODB_URL)
db = client.meetwise

@app.on_event("startup")
async def startup_db_client():
    try:
        client.admin.command('ping')
        print("Connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Import and include routes
from app.routes import meeting
from app.routes import user

app.include_router(meeting.router, prefix="/api/v1")
app.include_router(user.router, prefix="/api/v1")

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