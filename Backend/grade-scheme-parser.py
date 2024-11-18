import pdfplumber
import os
import csv

files = ['Stat230_Syllabus.pdf']

for file in files:
    read_path = os.path.join("pdfs", file)
    with pdfplumber.open(read_path) as pdf:
        all_tables = []
        schedule_table = []
        last_row = None  # To track the last row from the previous page

        for page in pdf.pages:
            table = page.extract_table()
            valid_schedule = False
            if table:
                temp_rows = []
                for row in table:
                    if last_row and row[0] == last_row[-1]: 
                        row = row[1:]
                    for col in row:
                        if col and 'Week' in col:
                            valid_schedule = True
                    temp_rows.append(row)
                    last_row = row  
                if valid_schedule:
                    schedule_table = schedule_table + temp_rows
                     
        
        output_path = os.path.join('csv', f"{file.split('_')[0]}_Schedule.csv")
        with open(output_path, mode='w', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(schedule_table)
