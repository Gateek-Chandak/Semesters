const express = require("express");
const router = express.Router();
const multer = require('multer');

// Controller functions
const { retrieve_schedule } = require('../controllers/pdfController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-schedule/', upload.single('pdf'), retrieve_schedule);
module.exports = router;