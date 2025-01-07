const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const jwt = require('jsonwebtoken');
const cookie = require('cookie')

// Controller functions
const { get_term_data } = require('../controllers/termDatabaseController');

router.post('/get-term-data', async (req, res) => {
    const { googleId } = req.body;
  
    if (!googleId) {
      return res.status(400).json({ error: 'Google ID is required' });
    }
  
    try {
      // Check if the user already exists
      const result = await pool.query('SELECT * FROM user_data WHERE google_id = $1', [googleId]);
  
      if (result.rows.length > 0) {
        // User exists
        return res.status(200).json({ exists: true, user: result.rows[0] });
      } else {
        return res.status(201).json({ exists: false });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/create-new-user', async (req, res) => {
    const { googleId, email, name } = req.body;
  
    if (!googleId) {
      return res.status(400).json({ error: 'Google ID is required' });
    }
  
    try {
        const result = await pool.query(
            `INSERT INTO user_data (google_id, email, name, term_data) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [googleId, email, name, JSON.stringify([{ term: 'Winter 2025', isCompleted: false, courses: [] }])]
        );

        return res.status(201).json({ user: result.rows[0] });

    } catch (error) {
        console.error(error);
        
        // Handle unique constraint violation (e.g., duplicate google_id)
        if (error.code === '23505') {
            return res.status(409).json({ error: 'User with this Google ID already exists' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/update-term-data', async (req, res) => {
  try {
    // 1. Parse the token from cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // 3. Extract user data from the decoded token (e.g., userId)
    const userId = decoded.id; // Assuming your token contains the 'userId'

    // 4. Get term data from request body (make sure to send the data as JSON in the body)
    const { termData } = req.body; // Make sure your request has termData

    if (!termData) {
      return res.status(400).json({ message: 'No term data provided' });
    }

    // 5. Make an SQL query to update the term data in the database
    const query = `
      UPDATE user_data
      SET term_data = $1
      WHERE google_id = $2
      RETURNING *;
    `;
    const values = [JSON.stringify(termData), userId]; // Term data should be stringified if it's an object

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ exists: false });
    }

    // 6. Send success response with the updated user data
    return res.status(200).json({ exists: true, data: result.rows[0] });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;