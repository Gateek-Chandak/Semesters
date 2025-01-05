// IMPORTS
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

const PORT = process.env.PORT || 4000

// ROUTES
const pdfRoutes = require('./routes/pdfRoutes');
const googleOAuthRoutes = require('./routes/googleOAuthRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes')
const termDatabaseRoutes = require('./routes/termDatabaseRoutes')

// MIDDLEWARE
const corsOptions = {
    origin: ['http://localhost:5173', 'https://semester-gateek-chandaks-projects.vercel.app'],
    methods: 'GET,POST',    
    credentials: true,
  };

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No Content
});

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

module.exports = app