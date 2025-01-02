# IMPORTS
import fitz  
import io

# this function uses the fitz library to parse a pdf and store the 
# text inside of a file held in /text
def parse_pdf(file):

    all_text = ""

    pdf_data = file.read()  # Read the uploaded file's content
    pdf_stream = io.BytesIO(pdf_data)  # Convert the data into a BytesIO stream

    # Open the PDF from the BytesIO stream
    pdf = fitz.open(stream=pdf_stream, filetype="pdf")

    for page_num in range(len(pdf)):
        page = pdf[page_num]
        text = page.get_text("text") 
        all_text += text + '\n'


    return all_text
