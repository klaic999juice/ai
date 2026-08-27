from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from backend.database import Base
from datetime import datetime

class Conversation(Base):
    """Model for storing conversations"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    model_used = Column(String(50), default="gpt-4-turbo-preview")
    tokens_used = Column(Integer, default=0)
    temperature = Column(Float, default=0.7)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Conversation(id={self.id}, model={self.model_used}, tokens={self.tokens_used})>"
