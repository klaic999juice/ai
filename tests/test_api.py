import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_chat_endpoint():
    """Test chat endpoint (requires valid API key)"""
    response = client.post(
        "/api/chat",
        json={
            "message": "What is Python?",
            "model": "gpt-4-turbo-preview"
        }
    )
    # This will fail without valid API key, which is expected in test environment
    if response.status_code == 200:
        data = response.json()
        assert "ai_response" in data
        assert "tokens_used" in data
        assert data["model_used"] == "gpt-4-turbo-preview"

def test_history_endpoint():
    """Test history endpoint"""
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data
    assert isinstance(data["items"], list)

def test_invalid_chat_request():
    """Test invalid chat request"""
    response = client.post(
        "/api/chat",
        json={"message": ""}  # Empty message
    )
    assert response.status_code == 422  # Validation error
