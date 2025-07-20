# evaluator.py

import os
import sys
import json
import google.generativeai as genai


def load_text_file(file_path: str) -> str:
    """Loads the raw text content of a .txt file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read().strip()


def load_json_file(file_path: str) -> dict:
    """Loads and parses a JSON file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_combined_prompt(teacher_text: str, student_json: dict, scheme_json: dict) -> str:
    student_json_str = json.dumps(student_json, indent=2)
    scheme_json_str = json.dumps(scheme_json, indent=2)

    prompt_template = f"""
You are an expert academic evaluator. Your task is to analyze a student's answer script against a teacher's answer key (in plain text) and a structured marking scheme (JSON). You must perform two tasks: first, score the exam numerically, and second, provide constructive feedback.

**Input Data:**
* Teacher's Answer Key (Text): 
{teacher_text}

* Student's Answer Script (JSON): ```json\n{student_json_str}\n```
* Marking Scheme (JSON): ```json\n{scheme_json_str}\n```

**Evaluation Instructions:**
1.  **Scoring:**
    * Assign an integer score for each question, proportional to its correctness, up to the `max_marks` in the scheme.
    * Calculate the `total_score_awarded` by summing the individual scores.
2.  **Feedback:**
    * Write brief, constructive feedback for each question explaining the score.
    * Write a brief `summary_feedback` for the student's overall performance.
3.  **Final Output:** Output must be a raw JSON object with two keys: `scores` and `feedback`.

**Output Format:**
```json
{{
  "scores": {{
    "student_id": "...",
    "total_score_awarded": ...,
    "detailed_scores": [...]
  }},
  "feedback": {{
    "student_id": "...",
    "summary_feedback": "...",
    "detailed_feedback": [...]
  }}
}}
"""
    return prompt_template.replace("{{", "{").replace("}}", "}")

def evaluate_answers(
    teacher_data: dict,
    student_data: dict,
    scheme_data: dict,
    api_key: str,
    model_name: str = "gemini-1.5-flash"
) -> dict:
    """
    Evaluates student answers and returns scores and feedback as a dictionary.

    Returns:
        {
            "scores": {...},
            "feedback": {...}
        }
    """
    # Configure the API key
    genai.configure(api_key=api_key)

    if teacher_key_path.endswith(".txt"):
      teacher_text = load_text_file(teacher_key_path)
      prompt = get_combined_prompt(teacher_text, student_data, scheme_data)
    else:
        teacher_data = load_json_file(teacher_key_path)
        prompt = get_combined_prompt(json.dumps(teacher_data, indent=2), student_data, scheme_data)


    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        combined_result = json.loads(cleaned_text)

        scores_result = combined_result.get("scores")
        feedback_result = combined_result.get("feedback")

        if not scores_result or not feedback_result:
            raise ValueError("The API response did not contain the expected 'scores' and 'feedback' keys.")

        return {
            "scores": scores_result,
            "feedback": feedback_result
        }

    except Exception as e:
        raise RuntimeError(f"Evaluation failed: {e}\nRaw response: {getattr(response, 'text', 'N/A')}")

