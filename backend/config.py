from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "gpt-4-turbo-preview"
    
    # Database
    database_url: str = "sqlite:///./ai_chat.db"
    
    # Application
    app_name: str = "AI Q&A Website"
    app_description: str = "An intelligent question-answering website powered by OpenAI"
    debug: bool = False
    
    # API Settings
    max_tokens: int = 2000
    temperature: float = 0.7
    top_p: float = 1.0
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
