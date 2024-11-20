import json
import os
import re

def json_convert(file_name):
    
    read_path = 'output'
    file_path = os.path.join(read_path, file_name)

    with open(file_path, mode='r', newline='') as t:
        text = t.read()
        schemes = {}
        for scheme in re.split(r'Grading Scheme [\dA-Za-z]+:', text):
            if scheme.strip():  # Skip empty splits
                lines = scheme.strip().split("\n")
                scheme_name = f"Grading Scheme {len(schemes) + 1}"
                items = {}
                for line in lines:
                    match = re.match(r"-\s*(.*),\s*(\d+(?:\.\d+)?)%", line.strip())
                    if match:
                        task, percentage = match.groups()
                        items[task] = float(percentage)
                schemes[scheme_name] = items
        
        return schemes
                    

def convert_files(files):
    for file in files:
        parsed_data = json_convert(file)
        json_data = json.dumps(parsed_data, indent=4)
        print(json_data)



files = [ "CFM101_assignments.txt",
          "Math239_assignments.txt",
          "Stat230_assignments.txt"      
]

payload = convert_files(files)