const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

router.get('/matches/:team1/:team2', async (req,res) => {
    const { team1,team2 } = req.params;

    try {
        pool.query(
            `
            SELECT 
    Team1 AS Team,
    SUM(CASE WHEN Result = 'Win' THEN 1 ELSE 0 END) AS Wins,
    SUM(CASE WHEN Result = 'Draw' THEN 1 ELSE 0 END) AS Draws,
    SUM(CASE WHEN Result = 'Loss' THEN 1 ELSE 0 END) AS Losses,
    SUM(CASE WHEN Result = 'Win' OR Result = 'Draw' OR Result = 'Loss' THEN 1 ELSE 0 END) AS Total
FROM (
    SELECT 
        Home_Team AS Team1,
        Away_Team AS Team2,
        CASE 
            WHEN Home_Goals > Away_Goals THEN 'Win'
            WHEN Home_Goals < Away_Goals THEN 'Loss'
            ELSE 'Draw'
        END AS Result
    FROM world_cup_matches
    WHERE 
        (Home_Team = "${team1}" AND Away_Team = "${team2}")
        OR 
        (Home_Team = "${team2}" AND Away_Team = "${team1}")

    UNION ALL
            
    SELECT 
        Away_Team AS Team1,
        Home_Team AS Team2,
        CASE 
            WHEN Away_Goals > Home_Goals THEN 'Win'
            WHEN Away_Goals < Home_Goals THEN 'Loss'
            ELSE 'Draw'
        END AS Result
    FROM world_cup_matches
    WHERE 
        (Home_Team = "${team1}" AND Away_Team = "${team2}")
        OR 
        (Home_Team = "${team2}" AND Away_Team = "${team1}")
) AS CombinedResults
GROUP BY Team1;
            `,
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


router.get('/info/:team/', async (req,res) => {
    const { team } = req.params;

    try {

        pool.query(
            `SELECT Team, FIFA_Ranking, \`Group\`
            FROM world_cup_groups_2022s
            WHERE Team = '${team}';`,
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