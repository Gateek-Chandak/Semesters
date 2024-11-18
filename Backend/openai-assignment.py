import os
import openai
from dotenv import load_dotenv

load_dotenv

openai.api_key = "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"

file_path = 'text/Stat230_Schedule.txt'

with open(file_path, 'r') as file:
    text = file.read()


response = openai.ChatCompletion.create(
  model="gpt-4o-mini", 
  messages=[
    {"role": "system", "content": "You are going to help me visualize all the assignments I have this semester."},
    {"role": "user", "content": "Extract all the weeks and their assignments with their respective topics from the following text:\n\n" + text}
  ]
)

output_path = os.path.join('text', f"assignment_breakdown.txt")
with open(output_path, mode='w', newline='') as f:
        f.write(response['choices'][0]['message']['content']) 