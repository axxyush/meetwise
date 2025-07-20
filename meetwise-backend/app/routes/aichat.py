# app/routes/aichat.py

import os
import openai
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from bson import ObjectId

from app.main import db
from app.routes.meeting import get_current_user  
from app.models.meeting import MeetingResponse, mongo_doc_to_meeting_response

# 1. load your key
openai.api_key = os.getenv("OPENAI_API_KEY")

# 2. define request & response shapes
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

router = APIRouter(
    prefix="/chat",
    tags=["aichat"]
)

@router.post(
    "/{meeting_id}",
    response_model=ChatResponse
)
async def chat_meeting(
    meeting_id: str,
    req: ChatRequest,
    user_id: str = Depends(get_current_user)
):
    # → fetch the meeting
    meeting = db.meetings.find_one({
        "_id": ObjectId(meeting_id),
        "userId": ObjectId(user_id)
    })
    if not meeting:
        raise HTTPException(404, "Meeting not found")

    segments = meeting.get("segments", [])
    if not segments:
        raise HTTPException(400, "No segments available to chat on")

    # → build a single “context” string of speaker: text
    context = "\n".join(
        f"{seg.get('speaker')}: {seg.get('text')}"
        for seg in segments
        if seg.get("text")
    )

    # → system + user messages
    messages = [
        {
            "role": "system",
            "content": (
                "You are an assistant that answers questions about this meeting. "
                "Here are the speaker‐segmented excerpts of the meeting:"
            )
        },
        {"role": "user", "content": context},
        {"role": "user", "content": req.message},
    ]

    # → call OpenAI
    resp = await openai.ChatCompletion.acreate(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7,
    )
    answer = resp.choices[0].message.content.strip()
    return ChatResponse(reply=answer)
