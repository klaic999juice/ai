# Retired AI - Q&A Website

An intelligent question-answering website powered by OpenAI's GPT API, similar to GitHub Copilot. Ask questions and get AI-generated answers with a beautiful, modern interface.

## 🎯 Features

- 🤖 **AI-Powered Q&A**: Get intelligent answers using OpenAI's GPT-4 Turbo
- 💬 **Chat Interface**: Clean, responsive chat UI similar to Copilot
- 📝 **Conversation History**: Keep track of all your questions and answers
- 🔐 **Secure API Key Management**: Environment variable-based configuration
- ⚡ **Real-time Responses**: Stream responses for better user experience
- 📊 **Token Tracking**: Monitor API usage with token counter
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile
- 💾 **SQLite Database**: Built-in conversation persistence

## 🛠 Tech Stack

### Backend
- **Python 3.9+** - Programming language
- **FastAPI** - Modern, fast web framework
- **OpenAI API** - GPT-4 Turbo for AI responses
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation and settings
- **Uvicorn** - ASGI web server

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (custom dark theme)
- **Vanilla JavaScript** - Interactive UI (no frameworks)
- **Fetch API** - Backend communication

## 📋 Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/klaic999juice/ai.git
cd ai
git checkout dev  # Switch to dev branch
```

### 2. Create Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
DATABASE_URL=sqlite:///./ai_chat.db
DEBUG=false
```

### 5. Run the Application
```bash
python backend/main.py
```

The application will start at **http://localhost:8000**

Open your browser and visit: `http://localhost:8000/static/index.html`

## 📡 API Endpoints

### POST `/api/chat`
Send a question and get an AI response.

**Request:**
```json
{
  "message": "How do I create a Python virtual environment?",
  "model": "gpt-4-turbo-preview",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "id": 1,
  "user_message": "How do I create a Python virtual environment?",
  "ai_response": "To create a Python virtual environment...",
  "model_used": "gpt-4-turbo-preview",
  "tokens_used": 150,
  "created_at": "2026-08-27T03:21:35Z"
}
```

### GET `/api/history?skip=0&limit=50`
Get conversation history (paginated).

**Query Parameters:**
- `skip` (default: 0) - Number of records to skip
- `limit` (default: 50, max: 100) - Number of records to return

**Response:**
```json
{
  "total": 42,
  "skip": 0,
  "limit": 50,
  "items": [
    {
      "id": 1,
      "user_message": "...",
      "ai_response": "...",
      "model_used": "gpt-4-turbo-preview",
      "tokens_used": 150,
      "created_at": "2026-08-27T03:21:35Z"
    }
  ]
}
```

### POST `/api/clear-history`
Clear all conversation history.

**Response:**
```json
{
  "message": "Deleted 42 conversations",
  "deleted_count": 42
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "AI Q&A API is running"
}
```

## 📁 Project Structure

```
ai/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings from .env
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── database.py          # Database setup and session management
│   ├── crud.py              # Database operations (Create, Read, Update, Delete)
│   └── ai_service.py        # OpenAI API integration service
├── frontend/
│   ├── index.html           # Main HTML interface
│   ├── css/
│   │   └── style.css        # Dark theme styling
│   └── js/
│       └── app.js           # Frontend application logic
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore patterns
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
└── README.md               # This file
```

## 🔧 Development

### Running with Auto-Reload
```bash
pip install -r requirements-dev.txt
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Code Formatting
```bash
black backend/
flake8 backend/
mypy backend/
```

### Running Tests
```bash
pytest tests/ -v
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t retired-ai:latest .
```

### Run Container
```bash
docker run -p 8000:8000 -e OPENAI_API_KEY=your_key retired-ai:latest
```

## 🚢 Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app --bind 0.0.0.0:8000
```

### Environment Variables for Production
```bash
OPENAI_API_KEY=your_production_key
DATABASE_URL=postgresql://user:password@localhost/retired_ai_db
DEBUG=false
ALLOWED_ORIGINS=https://yourdomain.com
```

## ⚙️ Configuration

Edit `backend/config.py` to customize:
- **Default AI Model**: Change `openai_model` (gpt-4-turbo-preview, gpt-3.5-turbo, etc.)
- **Max Tokens**: Adjust `max_tokens` per response
- **Temperature**: Control creativity (0.0-2.0, default: 0.7)
- **Database**: Configure connection string
- **CORS Origins**: Add allowed domains

## 🔒 Security Best Practices

- ⚠️ **Never commit `.env` file** with real API keys
- Use environment variables for all sensitive data
- Implement rate limiting for production
- Add authentication for multi-user scenarios
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated: `pip install --upgrade -r requirements.txt`

## 📈 Performance Tips

1. Use connection pooling for database
2. Implement caching for frequent queries
3. Use CDN for static assets
4. Monitor token usage and costs
5. Consider streaming responses for long outputs
6. Implement request queuing for high load

## 🐛 Troubleshooting

### "API key not found" Error
- Ensure `.env` file exists in root directory
- Verify `OPENAI_API_KEY` is set correctly
- Check that the key has API access enabled

### "Connection refused" Error
- Make sure backend is running: `python backend/main.py`
- Check if port 8000 is available
- Try a different port: `--port 8001`

### "CORS Error" in Browser Console
- Update `ALLOWED_ORIGINS` in `.env`
- Example: `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000`

### Database Errors
- Delete `ai_chat.db` and restart (creates new database)
- Check database URL in `.env`
- Ensure write permissions in directory

## 📚 API Documentation

Interactive API docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Create a GitHub Issue
- Check existing issues first
- Provide detailed error messages and logs

## 🙏 Acknowledgments

- OpenAI for the powerful GPT API
- FastAPI for the excellent web framework
- GitHub Copilot for UI inspiration

---

**Built with ❤️ for AI-powered conversations**

*Last Updated: August 27, 2026*
