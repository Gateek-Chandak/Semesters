const express = require("express");
const router = express.Router();

// PACKAGES
const { google, oauth2_v2 } = require('googleapis')
const path = require('path');
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const axios = require('axios')

require('dotenv').config();

// Extract the OAuth 2.0 Client 
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,
                                            process.env.SECRET_ID,
                                            process.env.REDIRECT);

// GET: Log-in route for initial user setup/log-in
router.get('/log-in', (req, res) => {
    // get url for google log-in
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
            'https://www.googleapis.com/auth/calendar.app.created',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent'
    });
    // send url to front-end
    res.status(200).json({url})
}); 

// GET: redirect route from Google OAuth 2.0 Client (Set up in google console and in .env file)
router.get('/redirect', async (req, res) => {

    // extract code from google OAuth Client
    const { code } = req.query;

    try {
        // get and set OAuth tokens
        const response = await oauth2Client.getToken(code);
        await oauth2Client.setCredentials(response.tokens);

        // get access token to use API's
        const access_token = oauth2Client.credentials.access_token;

        // get user data for identification
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        const userInfo = await oauth2.userinfo.get()
        const { id, email, name } = await userInfo.data;

        // create JWT token to store in cookie with all user data
        const token = jwt.sign(
            { id , email, name, access_token },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        // create browser cookie to hold user data + jwt token for future authentications
        res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
            httpOnly: true,  
            secure: true,    
            sameSite: 'Strict', 
            maxAge: 3600, // 1hr
            path: '/', 
        }));

        //redirect back to the front-end
        res.redirect(`http://localhost:5173/home`);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Authentication failed' })
    }
})

// GET: retrieve user data (NEEDS TO BE SET UP STILL)
router.get('/get-data', async (req, res) => {

    // parse cookies and get authToken
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // verify the token, then use decoded access_token to retrive API data
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {

        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // get data from google calendar (TEMP)
        try {
            const response = await axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
                headers: {
                    Authorization: `Bearer ${decoded.access_token}`    
                }           
            });

            res.status(200).json({ user: response.data });
        } catch (error) {
            res.status(500).json( { error: "error fetching data" } )
        }
    });
})

module.exports = router;
