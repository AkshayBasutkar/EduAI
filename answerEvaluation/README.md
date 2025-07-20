# Answer Script Evaluator

A comprehensive web application for evaluating answer scripts using AI-powered analysis. The system supports both handwritten and digital answer scripts, with multiple evaluation modes including OMR, descriptive, and mixed formats.

## Features

- **Multiple Evaluation Types**: OMR, Descriptive, and Mixed answer evaluation
- **Format Support**: Handwritten (image) and Digital (JSON) answer scripts
- **AI-Powered Analysis**: Uses Google's Gemini API for intelligent evaluation
- **Beautiful UI**: Modern, responsive interface with real-time progress indicators
- **Comprehensive Results**: Detailed scores, feedback, and downloadable reports
- **File Validation**: Automatic validation of uploaded files and formats

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- React Dropzone for file uploads
- Axios for API communication

### Backend
- Flask (Python)
- Google Generative AI (Gemini)
- Flask-CORS for cross-origin requests
- File upload handling with validation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   export GEMINI_API_KEY="your_gemini_api_key_here"
   ```
   
   Or create a `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

4. Run the backend server:
   ```bash
   python run.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Usage

1. **Select Evaluation Type**:
   - **OMR**: For multiple-choice questions (currently returns dummy data)
   - **Descriptive**: For written answers
   - **Mixed**: Combination of both (processed as descriptive)

2. **Choose Format** (for Descriptive/Mixed):
   - **Handwritten**: Upload scanned images (.jpg, .jpeg, .png)
   - **Digital**: Upload JSON files with structured answers

3. **Upload Files**:
   - **Student Answer Script**: Image or JSON file
   - **Teacher Key Answers**: Text file (.txt)
   - **Marking Scheme**: JSON file with scoring criteria

4. **Review Results**:
   - View detailed scores and grades
   - Read comprehensive feedback
   - Download results as JSON

## File Format Requirements

### Student Answer Scripts
- **Handwritten**: Image files (.jpg, .jpeg, .png)
- **Digital**: JSON files with the structure:
  ```json
  {
    "student_details": {
      "name": "Student Name",
      "student_id": "ID123"
    },
    "answers": [
      {
        "question_number": 1,
        "answer_text": "Answer content..."
      }
    ]
  }
  ```

### Teacher Answer Key
- Plain text file (.txt) with model answers

### Marking Scheme
- JSON file with scoring criteria:
  ```json
  {
    "questions": [
      {
        "question_number": 1,
        "max_marks": 10,
        "criteria": "Evaluation criteria..."
      }
    ]
  }
  ```

## API Endpoints

- `GET /health` - Health check
- `POST /evaluate` - Submit evaluation request

## Development

### Project Structure
```
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main application
├── backend/
│   ├── app.py          # Flask application
│   ├── main.py         # Core evaluation logic
│   ├── scan_scripts.py # Image processing
│   └── evaluate_script.py # Answer evaluation
└── README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.