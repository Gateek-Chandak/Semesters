const express = require("express");
const router = express.Router();
const cookie = require('cookie')

require('dotenv').config();

// METHODS
const { createCalendar, createEvents } = require('../controllers/calendarController')

// GET: retrieve user data (NEEDS TO BE SET UP STILL)
router.get('/create-calendar', async (req, res) => {
    // parse HTTP req header
    const cookies = cookie.parse(req.headers.cookie || '');
    // get accessToken from cookies
    const tokens = cookies.accessToken

    // Calendar Data (should be coming from req.params, temp set for testing purposes)
    const calendarData = {
        summary: 'Fall 2024',
        description: 'A secondary calendar created via API',
    };

    try {
        // create the calendar
        const createdCalendar = await createCalendar(calendarData, tokens)
        console.log('calendar created:' + calendarData.summary)
        const id = await createdCalendar.id
        res.status(200).json({ id: id }) // need to return the calendar ID in order to make future updates
    } catch (error){
        res.status(500).json({ error })
    }
})

router.get('/create-calendar', async (req, res) => {
    // parse HTTP req header
    const cookies = cookie.parse(req.headers.cookie || '');
    // get accessToken from cookies
    const tokens = cookies.accessToken

    const { calendarID } = req.params

    // Calendar Data
    const eventsDetails = {
        summary: 'Midterm Exam',
        description: 'Midterm exam for the Fall 2025 course.',
        location: 'Room 101, University of Washington',
        start: {
            dateTime: '2024-10-15T10:00:00-07:00',
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: '2024-10-15T12:00:00-07:00',
            timeZone: 'America/Los_Angeles',
        },
    };

    try {
        // create the event(s)
        const createdEvents = await createEvents(calendarID, eventsDetails, tokens)
        console.log('events created:' + createdEvents.data)

        res.status(200).json({ data: 'Events Created' })
    } catch (error){
        res.status(500).json({ error })
    }
})


module.exports = router;