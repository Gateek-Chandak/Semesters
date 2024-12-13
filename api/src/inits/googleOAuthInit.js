const { google } = require('googleapis')

require('dotenv').config();

// Extract the OAuth 2.0 Client 
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,
                                            process.env.SECRET_ID,
                                            process.env.REDIRECT
                                        );

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

module.exports = { oauth2Client, calendar }