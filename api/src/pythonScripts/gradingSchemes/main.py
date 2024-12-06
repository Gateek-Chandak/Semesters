import sys
import json
import io
from create_grading_schemes import create_course_grading_schemes

def main():
    try:

        pdf_data = sys.stdin.buffer.read()

        if not pdf_data:
            raise ValueError("The PDF data is empty. Check if the file was uploaded correctly.")

        # Create a BytesIO stream from the PDF data
        pdf_stream = io.BytesIO(pdf_data)

        grading_scheme_data = create_course_grading_schemes(pdf_stream)

        result = grading_scheme_data

    except Exception as e:
        result = {"error": f"Error processing PDF: {str(e)}"}

    # Print the result as JSON to stdout
    print(json.dumps(result))

if __name__ == "__main__":
    main()
