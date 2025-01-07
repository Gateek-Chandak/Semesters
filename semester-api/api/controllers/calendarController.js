const jwt = require('jsonwebtoken')

const {oauth2Client, calendar} = require('../inits/googleOAuthInit')

// GET (calendar/create-calendar)
async function createCalendar(calendarData, authToken) {
    if (!authToken) {
        throw new Error('No Token Found');
    }
    
    try {
        // Decode and set credentials of client
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        await oauth2Client.setCredentials(decoded.tokens);

        // Create the calendar
        const response = await calendar.calendars.insert({
            auth: oauth2Client, // Include OAuth client here
            requestBody: calendarData,
        });
        return response.data;
    } catch (error) {
        console.error('Error in createCalendar:', error.message); // Log the error message
        throw new Error(error.message); // Throw only the message
    }
}


async function createEvents(calendarId, eventsDetails, token) {
    if (!token) {
        throw new Error('No Token Found');
    }
    
    try {
        // Decode the JWT to extract credentials
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await oauth2Client.setCredentials(decoded.tokens);

        // Color mapping based on event color
        const colorMapping = {
            green: '5', // Banana
            blue: '9', // Blue
            pink: '11', // Pink
            purple: '4', // Flamingo
            black: '8', // Graphite
            orange: '6', // Tangerine
            black: '8' // Graphite
        };

        // Loop over the events array and insert each event
        const createdEvents = [];
        for (const event of eventsDetails) {
            const response = await calendar.events.insert({
                calendarId: calendarId,
                requestBody: {
                    summary: event.course + ' | ' + event.title,
                    description: event.course,
                    start: {
                        dateTime: event.start, // Ensure ISO format
                        timeZone: 'UTC',
                    },
                    end: {
                        dateTime: event.end, // Ensure ISO format
                        timeZone: 'UTC',
                    },
                    // Map the event color to Google Calendar colorId
                    colorId: colorMapping[event.color] || '1', // Default to '1' if color is not mapped
                },
            });
            createdEvents.push(response.data);
        }
        return createdEvents; // Return created events for logging or further processing
    } catch (error) {
        console.error('Error during event creation:', error);
        throw new Error('Failed to create events');
    }
}



module.exports = { createCalendar, createEvents };