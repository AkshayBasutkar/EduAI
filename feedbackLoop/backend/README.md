# Student Assessment Platform Backend

This is the Flask backend for the Student Assessment Platform that uses Google's Gemini AI to compare teacher and student scripts.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set your Gemini API key:
```bash
export GEMINI_API_KEY='your-api-key-here'
```

3. Run the server:
```bash
python server.py
```

The server will run on `http://localhost:8000`

## API Endpoints

### POST /compare
Compare teacher and student scripts and get AI feedback.

**Request Body:**
```json
{
  "teacherScript": "Teacher's reference answer...",
  "studentScript": "Student's submitted answer..."
}
```

**Response:**
```json
{
  "feedback": "Detailed AI feedback...",
  "sessionId": "unique-session-id"
}
```

### POST /chat
Send follow-up messages in an existing chat session.

**Request Body:**
```json
{
  "sessionId": "session-id-from-compare",
  "message": "User's follow-up question..."
}
```

**Response:**
```json
{
  "message": "AI assistant's response..."
}
```

### GET /health
Health check endpoint.

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Notes

- The server uses CORS to allow requests from the frontend
- Chat sessions are stored in memory (will be lost on server restart)
- For production, consider using a proper database for session storage