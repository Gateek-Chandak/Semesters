// IMPORTS
const express = require('express');
const cors = require('cors');
const multer = require('multer')

const app = express();

// ROUTES
const pdfRoutes = require('./routes/pdfRoutes');
const calendarRoutes = require('./routes/calendarRoutes');

// GLOBAL CONSTANTS
const PORT = 4000;

// MIDDLEWARE
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST',    
    credentials: true,
  };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); 
});

// POST (upload-pdf for grading scheme)
const upload = multer({ storage: multer.memoryStorage() });

app.use("/api/pdf/", pdfRoutes)
app.use("/api/google-calendar/", calendarRoutes)

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});