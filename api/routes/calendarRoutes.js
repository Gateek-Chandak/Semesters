const express = require("express");
const router = express.Router();
const cookie = require('cookie')
const jwt = require('jsonwebtoken')

require('dotenv').config();

// METHODS
const { createCalendar, createEvents } = require('../controllers/calendarController')

// GET: retrieve user data (NEEDS TO BE SET UP STILL)
router.get('/create-calendar', async (req, res) => {
    const { calendarName } = req.query;
    if (!calendarName) {
        return res.status(400).json({ error: 'Calendar name is required' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is missing' });
    }

    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken || !verifiedToken.tokens) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const calendarData = {
            summary: calendarName,
            description: 'hello',
        };

        const createdCalendar = await createCalendar(calendarData, token);
        console.log('Calendar created:', createdCalendar.summary);
        res.status(200).json({ id: createdCalendar.id });
    } catch (error) {
        console.error('Error creating calendar:', error.message); // Log the error message
        res.status(500).json({ error: error.message }); // Return only the error message to the client
    }
});


router.post('/create-events', async (req, res) => {
    // Parse cookies from the request
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.token; // Correct token name

    // Get calendar ID and events from query params or body
    const { id } = req.query;  // Get calendar ID from query params
    const events = req.body.events;  // Events should come from the request body

    // Check if events are provided
    if (!events || events.length === 0) {
        return res.status(400).json({ error: 'No events provided' });
    }

    try {
        // Create events in the calendar
        const createdEvents = await createEvents(id, events, accessToken);
        console.log('Events created');

        res.status(200).json({ data: 'Events Created' });
    } catch (error) {
        console.error('Error creating events:', error);
        res.status(500).json({ error: 'Failed to create events' });
    }
});




module.exports = router;