const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

//Route get all players on a selected team (Player Name, Position, Age, Caps, Goals)
router.get('/:team', async (req, res) => {
    const { team } = req.params;

    try {
        pool.query(
            `
            SELECT Player, Position, Age, Caps, Goals 
            FROM squads_2022s WHERE Team = ? 
            ORDER BY 
                CASE 
                    WHEN Position = 'Forward' THEN 1
                    WHEN Position = 'Midfielder' THEN 2
                    WHEN Position = 'Defender' THEN 3
                    WHEN Position = 'Goalkeeper' THEN 4
                    ELSE 5
                END,
                Player ASC
            `,
            [team],
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Failed to fetch players' });
                }
                res.json(results);
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;