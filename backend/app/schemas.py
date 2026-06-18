from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageSchema(BaseModel):
    sender: str
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str
    user_id: Optional[int] = 1

class ChatResponse(BaseModel):
    conversation_id: int
    user_message: MessageSchema
    ai_response: MessageSchema

class ConversationSchema(BaseModel):
    id: int
    title: str
    created_at: datetime
    
    class Config:
        from_attributes = True