from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: str
    email: EmailStr
    password: str
    createdAt: datetime
    updatedAt: datetime 