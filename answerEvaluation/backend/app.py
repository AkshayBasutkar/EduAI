from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import tempfile
from werkzeug.utils import secure_filename
from main import run_script_workflow
import traceback

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'json', 'jpg', 'jpeg', 'png'}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"})

@app.route('/evaluate', methods=['POST'])
def evaluate_script():
    try:
        # Check if API key is available
        api_key = "AIzaSyCYNmddaCiFaaKATOe5cUtP0r_ibqg"
        if not api_key:
            return jsonify({
                "error": "GEMINI_API_KEY environment variable not set"
            }), 500

        # Get form data
        evaluation_type = request.form.get('evaluation_type')  # omr, descriptive, mixed
        format_type = request.form.get('format_type', 'handwritten')  # handwritten, digital
        
        # Validate required fields
        if not evaluation_type:
            return jsonify({"error": "evaluation_type is required"}), 400
            
        if evaluation_type in ['descriptive', 'mixed'] and not format_type:
            return jsonify({"error": "format_type is required for descriptive/mixed evaluation"}), 400

        # Handle file uploads
        files = {}
        required_files = ['student_script', 'teacher_key', 'marking_scheme']
        
        for file_key in required_files:
            if file_key not in request.files:
                return jsonify({"error": f"{file_key} file is required"}), 400
            
            file = request.files[file_key]
            if file.filename == '':
                return jsonify({"error": f"{file_key} file is empty"}), 400
            
            if not allowed_file(file.filename):
                return jsonify({"error": f"Invalid file type for {file_key}"}), 400
            
            # Save file temporarily
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, f"{file_key}_{filename}")
            file.save(filepath)
            files[file_key] = filepath

        # Validate file types based on requirements
        student_script_path = files['student_script']
        teacher_key_path = files['teacher_key']
        marking_scheme_path = files['marking_scheme']
        
        # Validate student script format
        if format_type == 'handwritten':
            if not student_script_path.lower().endswith(('.jpg', '.jpeg', '.png')):
                return jsonify({"error": "Handwritten scripts must be image files (.jpg, .jpeg, .png)"}), 400
        else:  # digital
            if not student_script_path.lower().endswith('.json'):
                return jsonify({"error": "Digital scripts must be JSON files"}), 400
        
        # Validate teacher key format
        if not teacher_key_path.lower().endswith('.txt'):
            return jsonify({"error": "Teacher keys must be .txt files"}), 400
        
        # Validate marking scheme format
        if not marking_scheme_path.lower().endswith('.json'):
            return jsonify({"error": "Marking schemes must be JSON files"}), 400

        # Determine processing parameters
        is_handwritten = format_type == 'handwritten'
        answer_type = 'omr' if evaluation_type == 'omr' else 'script'
        
        # Run the evaluation workflow
        result = run_script_workflow(
            input_path=student_script_path,
            teacher_key_path=teacher_key_path,
            marking_scheme_path=marking_scheme_path,
            api_key=api_key,
            is_handwritten=is_handwritten,
            model_name="gemini-2.5-flash",
            answer_type=answer_type
        )
        
        # Clean up uploaded files
        for filepath in files.values():
            try:
                os.remove(filepath)
            except:
                pass  # Ignore cleanup errors
        
        return jsonify({
            "success": True,
            "result": result
        })
        
    except Exception as e:
        # Clean up uploaded files in case of error
        if 'files' in locals():
            for filepath in files.values():
                try:
                    os.remove(filepath)
                except:
                    pass
        
        error_message = str(e)
        traceback_str = traceback.format_exc()
        
        return jsonify({
            "error": error_message,
            "traceback": traceback_str
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)