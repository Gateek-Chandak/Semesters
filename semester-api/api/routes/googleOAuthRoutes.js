const express = require("express");
const router = express.Router();

// PACKAGES
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const {oauth2Client} = require('../inits/googleOAuthInit')
const { google } = require('googleapis')

require('dotenv').config();

// GET: Log-in route for initial user setup/log-in
router.get('/log-in', (req, res) => {
    // get url for google log-in
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
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

        //get user data for identification
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
  
        // const { access_token, refresh_token, expiry_date } = oauth2Client.credentials
        const userInfo = await oauth2.userinfo.get()
        const { id, email, name, picture } = await userInfo.data;

        // create JWT token to store in cookie with all user data
        const token = jwt.sign(
            { id , name, email, picture, tokens: oauth2Client.credentials },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        // create browser cookie to hold user jwt token for user credentials in order to verify future authentications
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,  
            secure: true,    
            sameSite: 'None', 
            maxAge: 3600, // 1hr
            path: '/', 
        }));

        //redirect back to the front-end
        res.redirect(`${process.env.URL}/home`);
    } catch (err) {
        console.log(err);
        res.redirect(`${process.env.URL}`)
    }
})

router.get('/verify', (req, res) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token

    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ isAuthenticated: true, user: decoded }); // Send user data if needed
    } catch (err) {
      console.error(err);
      res.status(401).json({ isAuthenticated: false });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
