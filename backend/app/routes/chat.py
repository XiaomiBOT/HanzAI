from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatRequest, ChatResponse, MessageSchema
from app.ai_engine import hanz_ai
from app.models import Message, Conversation
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/send", response_model=ChatResponse)
async def send_message(request: ChatRequest, db: Session = Depends(get_db)):
    """Send message and get AI response"""
    
    # Get or create conversation
    if request.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == request.conversation_id
        ).first()
    else:
        conversation = Conversation(user_id=request.user_id, title="New Chat")
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Save user message
    user_msg = Message(
        conversation_id=conversation.id,
        sender="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()
    
    # Generate AI response
    ai_response_text = await hanz_ai.chat(request.message)
    ai_msg = Message(
        conversation_id=conversation.id,
        sender="hanzai",
        content=ai_response_text["response"]
    )
    db.add(ai_msg)
    db.commit()
    
    return ChatResponse(
        conversation_id=conversation.id,
        user_message=MessageSchema(
            sender="user",
            content=request.message,
            timestamp=user_msg.timestamp
        ),
        ai_response=MessageSchema(
            sender="hanzai",
            content=ai_response_text["response"],
            timestamp=ai_msg.timestamp
        )
    )

@router.get("/conversations")
async def get_conversations(user_id: int = 1, db: Session = Depends(get_db)):
    """Get all conversations for user"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id
    ).all()
    return {"conversations": conversations}

@router.get("/history/{conversation_id}")
async def get_conversation_history(conversation_id: int, db: Session = Depends(get_db)):
    """Get message history for a conversation"""
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.timestamp).all()
    return {"messages": messages}