import pdfplumber
import os
import csv

files = ['Stat230_Syllabus.pdf']

for file in files:
    read_path = os.path.join("pdfs", file)
    with pdfplumber.open(read_path) as pdf:
        all_text = ""  # Initialize an empty string to hold all the text
        last_row = None  # To track the last row from the previous page

        for page in pdf.pages:
            table = page.extract_table()
            valid_schedule = False  # Track if this table contains 'Week'
            if table:
                for row in table:
                    # Check for continuation of the table and remove duplicate first cell if needed
                    if last_row and row[0] == last_row[-1]: 
                        row = row[1:]  # Remove duplicate first column
                    
                    for col in row:
                        if col and ' Week ' in col:  # Check if 'Week' is in the column
                            valid_schedule = True  # Mark the table as valid if 'Week' is found
                    
                    if valid_schedule:
                        # Add all the text from the row into the string, converting None to an empty string
                        all_text += " ".join(str(col) if col is not None else "" for col in row) + " \n"
                    
                    last_row = row  # Update last_row with the current row

        # After processing the table, save the concatenated text to a CSV
        if all_text:
            output_path = os.path.join('text', f"{file.split('_')[0]}_Schedule.txt")
            with open(output_path, mode='w', newline='') as f:
                f.write(all_text) 
