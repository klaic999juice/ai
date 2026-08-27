from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str = Field(..., min_length=1, max_length=5000, description="User's question")
    model: Optional[str] = Field(default="gpt-4-turbo-preview", description="Model to use")
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0, description="Temperature for response creativity")
    max_tokens: Optional[int] = Field(default=2000, ge=1, le=4000, description="Max tokens in response")

class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    id: int
    user_message: str
    ai_response: str
    model_used: str
    tokens_used: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationHistory(BaseModel):
    """Model for conversation history"""
    id: int
    user_message: str
    ai_response: str
    model_used: str
    tokens_used: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class HistoryListResponse(BaseModel):
    """Response model for history listing"""
    total: int
    skip: int
    limit: int
    items: list[ConversationHistory]

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
