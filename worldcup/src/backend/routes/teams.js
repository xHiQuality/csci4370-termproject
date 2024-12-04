const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
    try {
        pool.query('SELECT country_name FROM teams', (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to fetch teams' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
