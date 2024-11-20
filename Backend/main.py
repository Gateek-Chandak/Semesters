import grading_scheme_extractor
import syllabus_parser
import json_converter
import json

# List of PDF files to process
files = [
    "Stat230_Syllabus.pdf",
    "CFM101_Syllabus.pdf",
    "Math239_Syllabus.pdf",
]

#syllabus_parser.download_files(files)

text_paths = [
    'text/Stat230_file.txt',
    'text/Math239_file.txt', 
    'text/CFM101_file.txt', 
]

#grading_scheme_extractor.extract_course_info(text_paths)

grading_scheme_files = [ "CFM101_assignments.txt",
                         "Math239_assignments.txt",
                         "Stat230_assignments.txt"      
]

payload = json_converter.convert_files(grading_scheme_files)

parsed_data = {key: json.loads(value) for key, value in payload.items()}
parsed_data = json.dumps(parsed_data, indent=4)

print(parsed_data)

