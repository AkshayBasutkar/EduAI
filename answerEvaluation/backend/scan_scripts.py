#!/usr/bin/env python3
import sys
import json
import google.generativeai as genai

def configure_api(api_key: str):
    """
    Configures the Gemini API with the provided API key.
    """
    if not api_key:
        raise ValueError("API key is required to configure Gemini API.")
    genai.configure(api_key=api_key)

def process_answer_sheet(image_path: str, model_name: str = "gemini-2.5-flash") -> dict:
    """
    Processes an image of an answer sheet using the Gemini API and returns structured JSON data.

    Args:
        image_path: The file path to the input image.
        model_name: The name of the Gemini model to use.

    Returns:
        A dictionary containing the parsed data from the answer sheet.
    """
    print(f"INFO: Initializing model '{model_name}'...")
    try:
        model = genai.GenerativeModel(model_name)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize model '{model_name}': {e}")

    prompt = """
    Analyze the provided image of an answer sheet and extract the required information.
    Format the entire output as a single, raw JSON object. Do not include any text, code block markers, or explanations before or after the JSON.

    The JSON object must follow this structure exactly:
    {
      "student_details": {
        "name": "The student's name, or null if not found",
        "student_id": "The student's ID, or null if not found"
      },
      "questions_attempted": [
        "An array of integer question numbers that the student answered"
      ],
      "answers": [
        {
          "question_number": "The integer number for the question",
          "answer_text": "The full transcribed text of the answer for this question"
        }
      ]
    }

    Instructions:
    1.  **student_details**: If student details like name or ID are not on the page, use `null` for their values.
    2.  **answers**: Transcribe the complete text for each answer accurately.
    3.  **Final Output**: Ensure the output is only the JSON object itself, ready for parsing.
    """

    print(f"INFO: Reading image file at '{image_path}'...")
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"Input file not found at '{image_path}'")

    print("INFO: Sending request to Gemini API. This may take a moment...")
    try:
        response = model.generate_content(
            [{"mime_type": "image/jpeg", "data": image_data}, prompt]
        )
        cleaned_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        print(f"RAW RESPONSE:\n{response.text}", file=sys.stderr)
        raise ValueError("Failed to parse JSON from API response.")
    except Exception as e:
        raise RuntimeError(f"An API error occurred: {e}")
