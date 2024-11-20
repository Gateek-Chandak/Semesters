import openai_assignment
import assignment_schedule_parser

# List of PDF files to process
files = [
    "Stat230_Syllabus.pdf",
    "CFM101_Syllabus.pdf",
    "Math239_Syllabus.pdf",
]

# assignment_schedule_parser.download_files(files)

file_paths = [
    'text/Stat230_file.txt',
    'text/Math239_file.txt', 
    'text/CFM101_file.txt', 
]

# openai_assignment.extract_course_info(file_paths)