const { spawn } = require('child_process');

// Upload a PDF 
const uploadPDF = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;

    // Spawn a Python process to execute the script
    const pythonProcess = spawn('python3', ['src/pythonScripts/gradingSchemes/main.py']);

    pythonProcess.stdin.write(fileBuffer);
    pythonProcess.stdin.end();

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

    // Handle the case when no grading scheme is found
    if (result === 'no grading scheme found') {
        return res.status(400).json({ error: 'no grading scheme found' });
    }

    // Python script returns an error
    if (result.error) {
        return res.status(500).json({ error: result.error });
    }

    // Send the processed grading scheme data
    return res.status(200).json(result);
    });
}

module.exports = { uploadPDF };