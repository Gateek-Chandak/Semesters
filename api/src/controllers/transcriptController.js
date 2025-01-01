const { spawn } = require("child_process");
const Configuration = require('openai');
const OpenAIApi = require('openai')
const pdfParse = require("pdf-parse");
const multer = require("multer");
const upload = multer();
require("dotenv").config();

const prompt =`read this transcript, and extract me each term associated with the courses in that term, as well as the grades i got in each course.
               DO NOT PRINT ANYTHING OTHER THAN THE INFO`

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

const retrieve_transcript = async (req, res) => {
  try {
    // Parse the uploaded PDF
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);

    // Extract text from the PDF
    const extractedText = pdfData.text;

    // Define the prompt you want to send to OpenAI
    const prompt = "Please analyze the provided PDF content.";

    // Call OpenAI with the extracted text
    const aiResponse = await callOpenAI(extractedText);

    // Respond with the result from OpenAI
    console.log(aiResponse)
    res.status(200).json({ success: true, result: aiResponse });
  } catch (error) {
    console.error("Error processing transcript:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { retrieve_transcript, upload };
