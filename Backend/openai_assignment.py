# IMPORTS
import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

prompt = """
            Help me break down how I will be graded in this course

            Only list out the information on the assessments I will be assessed on. I want a seperate line item for each assesment. That means
            breaking down 3 quizzes into quiz 1,2,3.
            Follow this method for each line item.
            Assessment, Weight. 
            If there are 2 grade schemes, seperate them and create two plans. Remember if something is best x our of y, each assesment is only worth a fraction of the total
            percentage that the assesments are worth.
            Example:
            Grading Scheme 1:
            - Assignment 1, 5%
            - Assignment 2, 5%
            - Quiz 1, 7%
            - Midterm 1, 15%
            - Final Exam, 20%

        """

# This function uses the OpenAI API to read a text file and extract assignment information
def extract_course_info(file_paths):
  for file in file_paths:
    with open(file, 'r') as t:
        text = t.read()

    response = openai.ChatCompletion.create(
      model="gpt-4o", 
      messages=[
          {
              "role": "system",
              "content": ( prompt )
          },
          {
              "role": "user",
              "content": text 
          }
      ]
  )


    output_path = os.path.join('output', f"{file.split('/')[1].split('_')[0]}_assignments.txt")
    with open(output_path, mode='w', newline='') as f:
            f.write(response['choices'][0]['message']['content']) 
            print(f"Assignment file created to {output_path}")