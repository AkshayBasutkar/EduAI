import os
import google.generativeai as genai

def configure_api(api_key: str):
    """
    Configure the Google Generative AI API with the provided key.
    """
    genai.configure(api_key=api_key)
    print("Configured Gemini API.")


def load_text(path: str) -> str:
    """
    Load text content from a file.
    """
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def compare_scripts(api_key: str, teacher_script_path: str, student_script_path: str):
    """
    Compare teacher and student scripts and start an interactive feedback session.
    """
    configure_api(api_key)
    teacher_text = load_text(teacher_script_path)
    student_text = load_text(student_script_path)

    # Create a chat model instance
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    chat = model.start_chat()

    # Send system prompt first
    system_prompt = (
        "You are an educational assistant. You will compare the teacher's answer and the student's answer, "
        "identify mistakes or gaps in the student's response, and generate constructive feedback. "
        "After providing feedback, you will remain in an open chat mode until the user explicitly ends the session."
    )
    chat.send_message(system_prompt)

    # Provide the teacher and student scripts
    init_message = (
        f"### Teacher's Script:\n{teacher_text}\n\n"
        f"### Student's Script:\n{student_text}\n\n"
        "Please compare and give detailed feedback on the student's mistakes and how to improve."
    )
    response = chat.send_message(init_message)
    print("\n=== Feedback ===")
    print(response.text)

    # Interactive follow-up loop
    exit_commands = {"exit", "quit", "bye", "end", "stop"}
    print("\nYou can now ask follow-up questions or request advice. Type 'exit', 'quit', 'stop', or 'bye' to end.")
    while True:
        try:
            user_input = input("You: ")
        except (EOFError, KeyboardInterrupt):
            print("\nExiting chat. Goodbye!")
            break

        if user_input.strip().lower() in exit_commands:
            print("Exiting chat. Goodbye!")
            break

        reply = chat.send_message(user_input)
        print(f"Assistant: {reply.text}")


# Example usage:
# compare_scripts("YOUR_API_KEY", "teacher.txt", "student.txt")
