# AI Q&A Website

An intelligent question-answering website powered by OpenAI's GPT API, similar to GitHub Copilot. This application provides a web interface for users to ask questions and receive AI-generated answers.

## Features

- 🤖 **AI-Powered Q&A**: Get intelligent answers using OpenAI's GPT models
- 💬 **Chat Interface**: Clean, user-friendly chat UI
- 📝 **Conversation History**: Keep track of your questions and answers
- 🔐 **API Key Management**: Secure handling of API credentials
- ⚡ **Real-time Responses**: Stream responses for better UX
- 🎨 **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Backend
- **Python 3.9+**
- **FastAPI**: Modern async web framework
- **OpenAI API**: GPT-4/GPT-3.5 for AI responses
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **JavaScript (Vanilla)**: Interactive chat interface
- **Fetch API**: Communication with backend

## Prerequisites

- Python 3.9 or higher
- OpenAI API key (get one at https://platform.openai.com/api-keys)
- pip (Python package manager)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/klaic999juice/ai.git
cd ai
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./ai_chat.db
```

### 5. Run the Application
```bash
python main.py
```

The application will start at `http://localhost:8000`

## API Endpoints

### POST `/api/chat`
Send a question and get an AI response.

**Request:**
```json
{
  "message": "How do I create a Python virtual environment?",
  "model": "gpt-4"
}
```

**Response:**
```json
{
  "response": "To create a Python virtual environment...",
  "model": "gpt-4",
  "tokens_used": 150
}
```

### GET `/api/history`
Get conversation history (paginated).

**Query Parameters:**
- `skip` (default: 0)
- `limit` (default: 50)

### POST `/api/clear-history`
Clear conversation history.

## Project Structure

```
ai/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration settings
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database setup
│   ├── crud.py              # Database operations
│   └── ai_service.py        # OpenAI API integration
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── css/
│   │   └── style.css        # Styling
│   └── js/
│       └── app.js           # Frontend logic
├── .env.example             # Example environment variables
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Development

### Running in Development Mode
```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run with auto-reload
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Running Tests
```bash
pytest tests/
```

## Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app
```

### Docker
```bash
docker build -t ai-chat-app .
docker run -p 8000:8000 -e OPENAI_API_KEY=your_key ai-chat-app
```

## Configuration

Edit `backend/config.py` to customize:
- Default AI model (GPT-4, GPT-3.5-turbo, etc.)
- Max tokens per response
- Temperature (creativity level)
- Database settings

## Security

- ⚠️ Never commit `.env` file with real API keys
- Use environment variables for sensitive data
- Implement rate limiting for production
- Add authentication for multi-user scenarios
- Validate all user inputs

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please create a GitHub issue.

---

**Built with ❤️ for AI-powered conversations**
