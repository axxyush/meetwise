from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from pydantic import EmailStr
from app.models.user import UserCreate
from app.main import db
from datetime import datetime, timedelta
from bson import ObjectId
import jwt
import os
import hashlib

router = APIRouter(prefix="/user", tags=["user"])

JWT_SECRET = os.getenv("JWT_SECRET", "devsecret")
JWT_ALGO = "HS256"
JWT_EXP_MINUTES = 60 * 24 * 7  # 1 week

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_jwt(user_id: str, email: str):
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

@router.post("/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    now = datetime.utcnow()
    user_doc = {
        "email": user.email,
        "password": hash_password(user.password),
        "createdAt": now,
        "updatedAt": now
    }
    result = await db.users.insert_one(user_doc)
    return JSONResponse(status_code=201, content={"success": True, "user_id": str(result.inserted_id)})

@router.post("/login")
async def login(user: UserCreate):
    user_doc = await db.users.find_one({"email": user.email})
    if not user_doc or user_doc["password"] != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_jwt(str(user_doc["_id"]), user_doc["email"])
    return {"success": True, "token": token, "user_id": str(user_doc["_id"]), "email": user_doc["email"]} 