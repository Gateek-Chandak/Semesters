// IMPORTS
const express = require('express');
const cors = require('cors');
const multer = require('multer'); 
const { spawn } = require('child_process');

const app = express();

// GLOBAL CONSTANTS
const PORT = 4000;

// MIDDLEWARE
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,',    
  };

app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); 
});

// POST (upload-pdf for grading scheme)
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload-pdf/', upload.single('pdf'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  // Spawn a Python process to execute the script
  const pythonProcess = spawn('python3', ['src/pythonScripts/gradingSchemes/main.py', filePath]);

  let output = '';

  // Collect data from stdout
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  // Handle the process exit
  pythonProcess.on('close', (code) => {
    // If the script execution is unsuccessful, return a 500 error
    if (code !== 0) {
      return res.status(500).json({ error: 'An unknown error occurred' });
    }

    // Try to parse the Python script's JSON output
    let result;
    try {
      result = JSON.parse(output);
    } catch (err) {
      console.error('Error parsing Python output:', err);
      return res.status(500).json({ error: 'An unknown error occurred' });
    }

    // Python script returns an error
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    // Handle the case when no grading scheme is found
    if (result === 'no grading scheme found') {
      return res.status(400).json({ error: 'no grading scheme found' });
    }

    // Send the processed grading scheme data
    return res.status(200).json(result);
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});