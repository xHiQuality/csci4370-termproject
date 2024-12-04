const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

// Route: get all country names
// EXAMPLE: http://localhost:3001/api/teams
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

//Route: get flag of selected country
//EXAMPLE: http://localhost:3001/api/teams/Belgium/flag
router.get('/:country/flag', async(req,res) => {
    const { country } = req.params; //get from URL

    try {
        pool.query(
            'SELECT flag FROM teams WHERE country_name = ?',
            [country],
            (err, results) => {
                if (err) {
                    console.error('Database error:',err);
                    return res.status(500).json({error: 'Failed to fetch flag'})
                }
                if (results.length === 0) {
                    return res.status(404).json({error: 'Country not found'})
                }
                res.json(results[0])
            }
        )
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({error: 'Server error'});
    }
});


module.exports = router;
