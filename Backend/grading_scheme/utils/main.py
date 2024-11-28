from grading_scheme.utils import grading_scheme_extractor
from grading_scheme.utils import syllabus_parser
from grading_scheme.utils import json_converter

def create_course_grading_schemes(file):

    text = syllabus_parser.download_files(file)

    grading_scheme = grading_scheme_extractor.extract_course_info(text)

    if (grading_scheme == "no grading scheme found"):
        return "no grading scheme found"
        
    payload = json_converter.json_convert(grading_scheme)

    return payload