const express = require("express");
const router = express.Router();
const { google } = require('googleapis')
const path = require('path');

require('dotenv').config({ path: path.resolve(process.cwd(), 'src/.env') });

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,
                                            process.env.SECRET_ID,
                                            process.env.REDIRECT);

router.get('/log-in', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar',
        prompt: 'consent'
    });
    res.json({url})
}); 

router.get('/redirect', (req, res) => {
    const { code } = req.query;

    // Exchange authorization code for tokens
    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            return res.status(500).json({ error: 'Error getting tokens' });
        }
        oauth2Client.setCredentials(tokens);

        // Now you can use the oauth2Client to make authorized requests
        res.redirect('http://localhost:5173/home');
    });
})

module.exports = router;
