const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

//Route to get all 4 teams in a specific group
router.get('/:group', async (req,res) => {
    const { group } = req.params;

    try {
        pool.query(
            `SELECT Team
            FROM world_cup_groups_2022s WHERE world_cup_groups_2022s.Group = ?`,
            [group],
            (err, results) => {
                if (err) {
                    console.error('Database error:',err);
                    return res.status(500).json({error: 'Failed to fetch groups'})
                }
                res.json(results)
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({error: 'Server error'})
    }
});

module.exports= router;