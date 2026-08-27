from sqlalchemy.orm import Session
from backend.models import Conversation
from backend.schemas import ChatRequest
from typing import List, Optional

def create_conversation(
    db: Session,
    user_message: str,
    ai_response: str,
    model_used: str,
    tokens_used: int,
    temperature: float
) -> Conversation:
    """Create a new conversation record"""
    db_conversation = Conversation(
        user_message=user_message,
        ai_response=ai_response,
        model_used=model_used,
        tokens_used=tokens_used,
        temperature=temperature
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

def get_conversation(db: Session, conversation_id: int) -> Optional[Conversation]:
    """Get a single conversation by ID"""
    return db.query(Conversation).filter(Conversation.id == conversation_id).first()

def get_conversations(
    db: Session,
    skip: int = 0,
    limit: int = 50
) -> tuple[List[Conversation], int]:
    """Get paginated conversations"""
    total = db.query(Conversation).count()
    conversations = db.query(Conversation).offset(skip).limit(limit).all()
    return conversations, total

def clear_all_conversations(db: Session) -> int:
    """Clear all conversations and return count deleted"""
    count = db.query(Conversation).delete()
    db.commit()
    return count

def delete_conversation(db: Session, conversation_id: int) -> bool:
    """Delete a single conversation"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conversation:
        db.delete(conversation)
        db.commit()
        return True
    return False
