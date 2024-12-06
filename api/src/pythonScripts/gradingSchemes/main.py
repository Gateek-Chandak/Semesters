import sys
import json
from create_grading_schemes import create_course_grading_schemes

def main():
    # Read the file path from the command-line arguments
    file_path = sys.argv[1]  # The first argument passed by Node.js

    try:
        # Call the function and get the grading scheme
        with open(file_path, 'rb') as file:
            grading_scheme_data = create_course_grading_schemes(file)

        result = grading_scheme_data

    except Exception as e:
        result = {"error": f"Error processing PDF: {str(e)}"}

    # Print the result as JSON to stdout
    print(json.dumps(result))

if __name__ == "__main__":
    main()
