const jwt = require('jsonwebtoken')

const {oauth2Client, calendar} = require('../inits/googleOAuthInit')

// GET (calendar/create-calendar)
async function createCalendar(calendarData, authToken) {

    // if auth is invalid
    if (!authToken) {
        throw new Error('No Token Found');
    }
    
    try {
        // verify the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        // set credentials of client 
        await oauth2Client.setCredentials(decoded);
        //create the calendar
        const response = await calendar.calendars.insert({
            requestBody: calendarData
        });
        return response.data;
    } catch (error) {
        throw new Error ({error: error})
    }
    
}

async function createEvents(calendarId, eventsDetails, authToken) {

    // if auth is invalid
    if (!authToken) {
        throw new Error('No Token Found');
    }
    
    try {
        // verify the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        // set credentials of client 
        await oauth2Client.setCredentials(decoded);
        //create the events
        const response = await calendar.events.insert({
            calendarId: calendarId, 
            requestBody: eventsDetails,
        });

        return response;
    } catch (error) {
        throw new Error ({error: error})
    }
    
}

module.exports = { createCalendar, createEvents };