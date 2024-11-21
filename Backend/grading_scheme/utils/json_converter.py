import json
import os
import re

def json_convert(text):
    
    schemes = {}
    # Split the string into separate grading schemes
    sections = re.split(r'Grading Scheme \d+:', text)
    for i, section in enumerate(sections):
        if section.strip():  # Ignore empty sections
            scheme_name = f"Grading Scheme {i}"
            items = {}
            # Extract tasks and percentages
            for line in section.strip().split("\n"):
                match = re.match(r"-\s*(.*?),\s*(\d+(?:\.\d+)?)%", line.strip())
                if match:
                    task, percentage = match.groups()
                    items[task.strip()] = float(percentage)
            schemes[scheme_name] = items
    return schemes

