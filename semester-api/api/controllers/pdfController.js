const Configuration = require('openai');
const OpenAIApi = require('openai')
require("dotenv").config();
const pdfParse = require("pdf-parse");

const prompt = `
Help me break down how I will be graded in this course. The semester begins on September 6th and ends on December 2nd. 
Warning: The file presented may not be a syllabus. If you do not detect a syllabus, please return the text: "no assessment schedule found"

Only list out the information on the assessments I will be assessed on. I want a separate line item for each assessment. That means
breaking down 3 quizzes into quiz 1, 2, 3. If there are any weekly assessments, make sure to break it down, week by week.
Follow this method for each line item.
Assessment, Weight. 
Make sure the weights add up to 100
If there are 2 grade schemes, separate them and create two plans. Remember if something is best x out of y, each assessment is only worth a fraction of the total
percentage that the assessments are worth.
If there is no date and time for an assessment, insert: null
If one of the schemes have a weight of 0, still add that item just make the weight 0.
Make sure all dueDates are in ISO 8601 format. If a date is provided but no time is provided, default to 11:59pm on that day
FORMAT IT EXACTLY AS FOLLOWS:

{
  "gradingSchemes": [
    {
      "schemeName": "Grading Scheme 1",
      "assessments": [
        {
          "assessmentName": string,
          "weight": number,
          "dueDate": ISO 8601 Standard format
        }
      ]
    },
    {
      "schemeName": "Grading Scheme 2",
      "assessments": [
        {
          "assessmentName": string,
          "weight": number,
          "dueDate": ISO 8601 Standard Format
        }
      ]
    }
  ]
}
If you do not detect any grading scheme data, please return the text: no assessment schedule found
DO NOT PRINT ANYTHING OTHER THAN THE JSON OBJECT`

// OPEN AI CONFIG
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const callOpenAI = async (prompt, content) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Specify the model (e.g., "gpt-4", "gpt-3.5-turbo")
      messages: [
        { role: "system", content: `You are a pdf assistant, the content is ${content}` },
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
}

const retrieve_schedule = async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'No valid file uploaded' });
  }

  const fileBuffer = req.file.buffer;
  const pdfData = await pdfParse(fileBuffer);

  // Extract text from the PDF
  const extractedText = pdfData.text;

  const result = await callOpenAI(prompt, extractedText)
    try {
      if (result === "no assessment schedule found") {
        return res.status(400).json({ error: 'no assessment schedule found' });
      }

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      console.log(result)
      return res.status(200).json(result);

    } catch (err) {
      console.error('Error parsing JSON:', err);
      return res.status(500).json({ error: 'Invalid JSON from Python script' });
    }
};

module.exports = { retrieve_schedule };
