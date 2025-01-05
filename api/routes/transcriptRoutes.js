const express = require("express");
const router = express.Router();
const multer = require('multer');

// Controller functions
const { retrieve_transcript } = require('../controllers/transcriptController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-transcript/', upload.single('pdf'), retrieve_transcript);
module.exports = router;