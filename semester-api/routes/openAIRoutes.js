const express = require('express');
const Configuration = require('openai');
const OpenAIApi = require('openai')
require('dotenv').config();

const router = express.Router();

// Configure OpenAI client
const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

const parseData = (data) => {
    return data.trim().split("\n").map((row) => {
      const [order, name, setsReps] = row.split(" | ");
      return { order, name, setsReps };
    });
  };

// POST a response
router.post('/generate-response', async (req, res) => {
    const { content, difficulty, numOfExercises } = req.body

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: `give me a ${numOfExercises} x 3 table with ${numOfExercises} ${content} exercizes of ${difficulty} intensity, the order, name, and [sets x reps]. Include 1 or 2 compound lifts, then 3 isolated accessories. Do not include any other words. format it like this '1 | chest press | 3 x 5'` }],
            model: "gpt-4o",
        });
        const rows = await completion.choices[0].message.content.split('\n')

        const exercises = rows.map(row => {
            const [order, name, setsReps] = row.split('|').map(item => item.trim());
            return { order, name, setsReps };
        });
        //console.log(completion.choices[0].message.content)
        console.log(exercises);
        res.status(200).json({ response: exercises });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error generating response" });
    }
});

module.exports = router;
