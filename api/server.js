// IMPORTS
const express = require('express');
const cors = require('cors');
const app = express();

// ROUTES
const pdfRoutes = require('./src/routes/pdfRoutes');
const googleOAuthRoutes = require('./src/routes/googleOAuthRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes');
const transcriptRoutes = require('./src/routes/transcriptRoutes')
const termDatabaseRoutes = require('./src/routes/termDatabaseRoutes')

// GLOBAL CONSTANTS
const PORT = 4000;

// MIDDLEWARE
const corsOptions = {
    origin: ['http://localhost:5173', 'https://semester-gateek-chandaks-projects.vercel.app'],
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

// ROUTES
app.use("/api/pdf/", pdfRoutes)
app.use("/api/auth/", googleOAuthRoutes)
app.use("/api/calendar/", calendarRoutes)
app.use("/api/transcript/", transcriptRoutes)
app.use("/api/term-database/", termDatabaseRoutes)

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
