from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.orm import Session
import logging
from pathlib import Path
import os

from backend.config import settings
from backend.database import get_db, Base, engine
from backend.schemas import ChatRequest, ChatResponse, HealthResponse, HistoryListResponse
from backend.crud import create_conversation, get_conversations, clear_all_conversations
from backend.ai_service import AIService

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version="1.0.0"
)

# Setup CORS - Allow all origins for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get frontend path
frontend_path = Path(__file__).parent.parent / "frontend"

# Try to mount static files if they exist
try:
    if frontend_path.exists():
        app.mount("/static", StaticFiles(directory=frontend_path), name="static")
        logger.info(f"Static files mounted from {frontend_path}")
except Exception as e:
    logger.warning(f"Could not mount static files: {e}")

# Root route - serve index.html or embedded HTML
@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the main application"""
    try:
        index_path = frontend_path / "index.html"
        if index_path.exists():
            with open(index_path, 'r') as f:
                return f.read()
    except Exception as e:
        logger.error(f"Error reading index.html: {e}")
    
    # Fallback: Return basic welcome
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Retired AI</title>
        <style>
            body { font-family: Arial; margin: 50px; }
            h1 { color: #0ea5e9; }
        </style>
    </head>
    <body>
        <h1>🤖 Retired AI</h1>
        <p>Loading application...</p>
        <p><a href="/docs">API Documentation</a></p>
    </body>
    </html>
    """

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "AI Q&A API is running"}

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """Send a question and get AI response"""
    try:
        # Get AI response
        ai_response, tokens_used = AIService.get_response(
            message=request.message,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        # Save conversation to database
        conversation = create_conversation(
            db=db,
            user_message=request.message,
            ai_response=ai_response,
            model_used=request.model,
            tokens_used=tokens_used,
            temperature=request.temperature
        )
        
        logger.info(f"Conversation saved - ID: {conversation.id}")
        
        return ChatResponse(
            id=conversation.id,
            user_message=conversation.user_message,
            ai_response=conversation.ai_response,
            model_used=conversation.model_used,
            tokens_used=conversation.tokens_used,
            created_at=conversation.created_at
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# History endpoint
@app.get("/api/history", response_model=HistoryListResponse)
async def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get conversation history (paginated)"""
    try:
        conversations, total = get_conversations(db, skip=skip, limit=limit)
        
        return HistoryListResponse(
            total=total,
            skip=skip,
            limit=limit,
            items=[ChatResponse(
                id=conv.id,
                user_message=conv.user_message,
                ai_response=conv.ai_response,
                model_used=conv.model_used,
                tokens_used=conv.tokens_used,
                created_at=conv.created_at
            ) for conv in conversations]
        )
        
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Clear history endpoint
@app.post("/api/clear-history")
async def clear_history(db: Session = Depends(get_db)):
    """Clear all conversation history"""
    try:
        count = clear_all_conversations(db)
        return {"message": f"Deleted {count} conversations", "deleted_count": count}
    except Exception as e:
        logger.error(f"Error clearing history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
