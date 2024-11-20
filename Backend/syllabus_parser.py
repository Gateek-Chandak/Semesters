# IMPORTS
import os
import fitz  

# this function uses the fitz library to parse a pdf and store the 
# text inside of a file held in /text
def download_files(files):

    #directories
    pdf_dir = "pdfs" 
    output_dir = "text" 

    # loop through each file
    for file in files:
        read_path = os.path.join(pdf_dir, file)

        all_text = ""

        pdf = fitz.open(read_path)
        for page_num in range(len(pdf)):
            page = pdf[page_num]
            text = page.get_text("text") 
            all_text += text + '\n'

        # save file to /text
        if all_text:
            output_path = os.path.join(output_dir, f"{file.split('_')[0]}_file.txt")
            with open(output_path, mode="w", newline="") as f:
                f.write(all_text)
            print(f"Extracted data saved to {output_path}")