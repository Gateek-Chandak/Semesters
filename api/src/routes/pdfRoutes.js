const express = require("express");
const router = express.Router();
const multer = require('multer');

// Controller functions
const { uploadPDF } = require('../controllers/pdfController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-pdf/', upload.single('pdf'), uploadPDF);

module.exports = router;