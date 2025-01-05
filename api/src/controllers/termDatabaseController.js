const db = require('../database/db')

async function insertUserData(googleId, termData) {
    try {
        const query = 'INSERT INTO user_data (google_id, term_data) VALUES ($1, $2)';
        const values = [googleId, JSON.stringify(termData)];
        await db.query(query, values);
        console.log('User data inserted successfully');
    } catch (err) {
        console.error('Error inserting user data:', err);
    }
}

async function get_term_data(googleId) {
    try {
        const query = 'SELECT google_id, term_data FROM user_data WHERE google_id = $1';
        const result = await db.query(query, [googleId]);
        return result.rows[0];  // Returns the first row if found
    } catch (err) {
        console.error('Error fetching user data:', err);
        return null;
    }
}

module.exports = { get_term_data }