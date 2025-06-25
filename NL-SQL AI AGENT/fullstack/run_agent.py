import sys
import json
from core.agentgraph import app

def main():
    if len(sys.argv) < 4:
        print(json.dumps({
            "success": False,
            "error": "Missing arguments: question, user_email, designation"
        }))
        return

    question = sys.argv[1]
    user_email = sys.argv[2]
    designation = sys.argv[3]

    input_data = {
        "question": question,
        "user_email": user_email,
        "designation": designation
    }

    try:
        result = app.invoke(input_data)
        # Return only what’s needed
        output = {
            "success": True,
            "result": result
        }
    except Exception as e:
        output = {
            "success": False,
            "error": str(e),
            "input_data": input_data
        }

    print(json.dumps(output))

if __name__ == "__main__":
    main()