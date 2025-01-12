const { spawn } = require("child_process");
const Configuration = require('openai');
const OpenAIApi = require('openai')
const pdfParse = require("pdf-parse");
const multer = require("multer");
const upload = multer();
require("dotenv").config();

const prompt =`read this transcript, and extract me each term with the courses in that term, as well as the grades i got in each course. Make sure you include course Code as well as the Name of the course
               DO NOT PRINT ANYTHING OTHER THAN THE INFO. 
               If a course does not have a grade, and is a CR or NCR, then dont include it
               If this document is NOT a transcript return the following: no transcript found
               THIS IS AN EXAMPLE: NOT WHAT YOU SHOULD RETURN.
               Fall 2023:
                - ARTS 140: Video Game Research: 91
                - CS 115: Intro to CS: 95
                - GBDA 101: Intro to Design: 82
                - MATH 135: Algebra: 88
                - SPAN 101: Spanish I: 86 `

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const callOpenAI = async (content) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
                { role: "system", content: `You are a PDF assistant. The content is: ${content}` },
                { role: "user", content: prompt },
            ],
            });

    let result = await response.choices[0].message.content;

    if (result.startsWith("```json")) {
      result = result.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    return result;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

function parseCourses(inputText) {
  const terms = [];
  const termRegex = /([A-Za-z]+\s\d{4}):\s*((?:-\s.+?\n)+)/g; // Match terms and courses
  const courseRegex = /-\s([A-Za-z\s\d]+):\s([A-Za-z\s\d]+):\s?(\d+|CR)?/; // Match courses (course code, title, grade)

  let termMatch;
  while ((termMatch = termRegex.exec(inputText)) !== null) {
    const term = termMatch[1];
    const coursesText = termMatch[2].trim();
    const courses = [];

    let courseMatch;
    // Split courses by new lines and match each one
    const coursesList = coursesText.split("\n");
    for (let courseText of coursesList) {
      courseMatch = courseRegex.exec(courseText);
      if (courseMatch) {
        const [_, courseTitle, courseSubtitle, grade] = courseMatch;
        courses.push({
          courseTitle,
          courseSubtitle,
          highestGrade: Number(grade) || 0,
          colour: 'black',
          gradingSchemes: []
        });
      }
    }

    terms.push({
      term,
      isCompleted: true,
      courses,
    });
  }

  return terms;
}

const retrieve_transcript = async (req, res) => {
  try {
    // Parse the uploaded PDF
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);

    // Extract text from the PDF
    const extractedText = pdfData.text;

    // Call OpenAI with the extracted text
    const aiResponse = await callOpenAI(extractedText);

    if (aiResponse === 'no transcript found') {
      res.status(500).json({ error: 'no transcript found' });
      return;
    }
    const response = await parseCourses(aiResponse)

    // Respond with the result from OpenAI
    res.status(200).json({ result: response });
    return;
  } catch (error) {
    console.error("Error processing transcript:", error);
    res.status(500).json({ error: 'error processing transcript' });
    return;
  }
};

module.exports = { retrieve_transcript, upload };
