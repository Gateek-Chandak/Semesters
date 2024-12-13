const express = require("express");
const router = express.Router();

// PACKAGES
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const {oauth2Client} = require('../inits/googleOAuthInit')

require('dotenv').config();

// GET: Log-in route for initial user setup/log-in
router.get('/log-in', (req, res) => {
    // get url for google log-in
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/calendar',
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

        // get user data for identification
        // const oauth2 = google.oauth2({
        //     auth: oauth2Client,
        //     version: 'v2'
        // });
  
        // // const { access_token, refresh_token, expiry_date } = oauth2Client.credentials
        // const userInfo = await oauth2.userinfo.get()
        // const { id, email, name } = await userInfo.data;

        // // create JWT token to store in cookie with all user data
        // const token = jwt.sign(
        //     { id , name, tokens },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '1h' } 
        // );

        // encrypt accessTokens using JWT to store the users google credentials
        const accessToken = jwt.sign(oauth2Client.credentials, process.env.JWT_SECRET, { expiresIn: '1h' })

        // create browser cookie to hold user jwt token for user credentials in order to verify future authentications
        res.setHeader('Set-Cookie', cookie.serialize('accessToken', accessToken, {
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

module.exports = router;
