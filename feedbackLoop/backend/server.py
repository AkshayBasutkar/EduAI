from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import os
import google.generativeai as genai
from typing import Dict, Any

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store active chat sessions
chat_sessions: Dict[str, Any] = {}

def configure_api():
    """Configure the Google Generative AI API."""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    
    genai.configure(api_key=api_key)
    print("Configured Gemini API.")

@app.route('/compare', methods=['POST'])
def compare_scripts():
    """Compare teacher and student scripts and return feedback."""
    try:
        data = request.get_json()
        teacher_script = data.get('teacherScript', '')
        student_script = data.get('studentScript', '')
        
        if not teacher_script or not student_script:
            return jsonify({'error': 'Both teacher and student scripts are required'}), 400
        
        # Configure API
        configure_api()
        
        # Create a new chat session
        model = genai.GenerativeModel(model_name="gemini-2.5-flash")
        chat = model.start_chat()
        
        # Send system prompt
        system_prompt = (
            "You are an educational assistant. You will compare the teacher's answer and the student's answer, "
            "identify mistakes or gaps in the student's response, and generate constructive feedback. "
            "Provide detailed, helpful feedback that helps the student understand their mistakes and learn better. "
            "Structure your feedback clearly with specific points about what was correct, what was incorrect, "
            "and suggestions for improvement."
        )
        chat.send_message(system_prompt)
        
        # Generate comparison
        comparison_prompt = (
            f"### Teacher's Script:\n{teacher_script}\n\n"
            f"### Student's Script:\n{student_script}\n\n"
            "Please compare these scripts and provide detailed feedback on the student's performance, "
            "highlighting both strengths and areas for improvement."
        )
        
        response = chat.send_message(comparison_prompt)
        feedback = response.text
        
        # Generate session ID and store the chat
        session_id = str(uuid.uuid4())
        chat_sessions[session_id] = {
            'chat': chat,
            'teacher_script': teacher_script,
            'student_script': student_script,
            'initial_feedback': feedback
        }
        
        return jsonify({
            'feedback': feedback,
            'sessionId': session_id
        })
        
    except Exception as e:
        print(f"Error in compare_scripts: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500

@app.route('/chat', methods=['POST'])
def chat_message():
    """Handle follow-up chat messages."""
    try:
        data = request.get_json()
        session_id = data.get('sessionId', '')
        message = data.get('message', '')
        
        if not session_id or not message:
            return jsonify({'error': 'Session ID and message are required'}), 400
        
        if session_id not in chat_sessions:
            return jsonify({'error': 'Invalid session ID'}), 404
        
        # Get the chat session
        session = chat_sessions[session_id]
        chat = session['chat']
        
        # Send the user's message
        response = chat.send_message(message)
        
        return jsonify({
            'message': response.text
        })
        
    except Exception as e:
        print(f"Error in chat_message: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv('GEMINI_API_KEY'):
        print("Warning: GEMINI_API_KEY environment variable not set!")
        print("Please set your Gemini API key: export GEMINI_API_KEY='your-api-key-here'")
    
    app.run(debug=True, host='0.0.0.0', port=8000)