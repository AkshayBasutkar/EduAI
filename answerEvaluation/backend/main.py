from scan_scripts import process_answer_sheet, configure_api as configure_scanner
from evaluate_script import evaluate_answers, load_json_file, load_text_file, get_combined_prompt
import json
import os

def run_script_workflow(
    input_path: str,
    teacher_key_path: str,
    marking_scheme_path: str,
    api_key: str,
    is_handwritten: bool,
    model_name: str = "gemini-2.5-flash",
    answer_type: str = "script"  # can be 'script' or 'omr'
) -> dict:

    # Step 1: Configure API
    configure_scanner(api_key)

    # Step 2: Handle Answer Type
    if answer_type == "omr":
        print("📄 OMR evaluation mode selected. Generating dummy result...")
        result = {
            "scores": {
                "student_id": "OMR_DUMMY_001",
                "total_score_awarded": 18,
                "detailed_scores": [
                    {"question_number": 1, "max_marks": 1, "marks_awarded": 1},
                    {"question_number": 2, "max_marks": 1, "marks_awarded": 0},
                    {"question_number": 3, "max_marks": 1, "marks_awarded": 1},
                ]
            },
            "feedback": {
                "student_id": "OMR_DUMMY_001",
                "summary_feedback": "OMR sheet evaluated with dummy data. Actual logic coming soon.",
                "detailed_feedback": [
                    {"question_number": 1, "feedback": "Correct bubble selected."},
                    {"question_number": 2, "feedback": "Incorrect bubble selected."},
                    {"question_number": 3, "feedback": "Correct bubble selected."}
                ]
            }
        }
        print("✅ Dummy OMR evaluation completed.")
        return result

    # Step 3: Get student data (script-based)
    if is_handwritten:
        print("📝 Extracting student data from handwritten answer script...")
        student_data = process_answer_sheet(input_path, model_name)
    else:
        print("💻 Loading digital answer script...")
        with open(input_path, 'r', encoding='utf-8') as f:
            student_data = json.load(f)

    # Step 4: Load teacher key
    if teacher_key_path.endswith(".txt"):
        teacher_text = load_text_file(teacher_key_path)
        teacher_json = None
    else:
        teacher_json = load_json_file(teacher_key_path)
        teacher_text = json.dumps(teacher_json, indent=2)

    # Step 5: Load marking scheme
    scheme_data = load_json_file(marking_scheme_path)

    # Step 6: Generate prompt
    print("🧠 Generating evaluation prompt...")
    prompt = get_combined_prompt(teacher_text, student_data, scheme_data)

    from google.generativeai import GenerativeModel
    model = GenerativeModel(model_name)
    response = model.generate_content(prompt)

    # Step 7: Clean output
    cleaned_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
    result = json.loads(cleaned_text)

    # Step 8: Save result
    with open("final_evaluation_result.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print("✅ Evaluation complete! Saved to 'final_evaluation_result.json'")
    return result


# # 🧪 Example run
# if __name__ == "__main__":
#     run_script_workflow(
#         input_path="tests\\custom_ans.jpg",
#         teacher_key_path="tests\\answers.txt",
#         marking_scheme_path="tests\\schema.json",
#         api_key="AIzaSyCYNmddaCiFaaKATOe5ke_WcUtP0r_ibqg",
#         is_handwritten=True,
#         answer_type="script"  # Change to "omr" to test dummy OMR result
#     )
