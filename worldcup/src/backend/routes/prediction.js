const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

//Formula Logic
const calculatePredictor = (highestRank,homeRank,awayRank,avgCapsHome,avgCapsAway,h2hHome,h2hAway,avgGoalsHome,avgGoalsAway) => {
    const randomValue = Math.random() * 40 - 20;
    return 0.35 * ((highestRank - homeRank) + (awayRank - highestRank)) +
        0.1 * (avgCapsHome - avgCapsAway) +
        0.15 * (h2hHome - h2hAway) +
        0.2 * (avgGoalsHome - avgGoalsAway) +
        0.2 * randomValue;

};

//API endpoint for group predictions
router.get('/all-group-predictions', async (req,res) => {
    try {
        
        //group Names
        const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        //console.log(groups)

        const allResults = {};

        for (const groupName of groups) {
           

            //Fetch teams in group
            const [teams] = await pool.query(
                `SELECT Team, FIFA_Ranking FROM world_cup_groups_2022s WHERE \`Group\` = ?`,
                [groupName]
            );

            if (teams.length === 0) continue;

            const groupResults = [];
            const teamPoints = [];

            //init points for all teams to 0
            teams.forEach(team => {
                teamPoints[team.Team] = 0;
            });

            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    const homeTeam = teams[i];
                    const awayTeam = teams[j];

                    //Fetch avg caps & goals
                    const [[homeStats]] = await pool.query(
                        `SELECT AVG(Caps) AS avg_caps, AVG(Goals) as avg_goals
                        FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')
                        `,
                        [homeTeam.Team]
                    );
                    const [[awayStats]] = await pool.query(
                        `SELECT AVG(Caps) AS avg_caps, AVG(Goals) as avg_goals
                        FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')
                        `,
                        [awayTeam.Team]
                    );

                    // Fetch H2H points for both teams
                    const [[homeH2HPoints]] = await pool.query(
                        `SELECT SUM(
                            CASE 
                                WHEN Home_Team = ? AND Home_Goals > Away_Goals THEN 3
                                WHEN Home_Team = ? AND Home_Goals = Away_Goals THEN 1
                                WHEN Away_Team = ? AND Away_Goals > Home_Goals THEN 3
                                WHEN Away_Team = ? AND Away_Goals = Home_Goals THEN 1
                                ELSE 0
                            END
                        ) AS h2h_points
                        FROM world_cup_matches
                        WHERE (Home_Team = ? AND Away_Team = ?)
                        OR (Home_Team = ? AND Away_Team = ?)`,
                        [
                            homeTeam.Team,
                            homeTeam.Team, 
                            homeTeam.Team, 
                            homeTeam.Team, 
                            homeTeam.Team, awayTeam.Team,
                            awayTeam.Team, homeTeam.Team  
                        ]
                    ) || [{}];

                    const [[awayH2HPoints]] = await pool.query(
                        `SELECT SUM(
                            CASE 
                                WHEN Home_Team = ? AND Home_Goals > Away_Goals THEN 3
                                WHEN Home_Team = ? AND Home_Goals = Away_Goals THEN 1
                                WHEN Away_Team = ? AND Away_Goals > Home_Goals THEN 3
                                WHEN Away_Team = ? AND Away_Goals = Home_Goals THEN 1
                                ELSE 0
                            END
                        ) AS h2h_points
                        FROM world_cup_matches
                        WHERE (Home_Team = ? AND Away_Team = ?)
                        OR (Home_Team = ? AND Away_Team = ?)`,
                        [
                            awayTeam.Team, 
                            awayTeam.Team, 
                            awayTeam.Team, 
                            awayTeam.Team, 
                            homeTeam.Team, awayTeam.Team, 
                            awayTeam.Team, homeTeam.Team  
                        ]
                    ) || [{}];

                    // debugging
                    // console.log('H2H Home Points:', homeH2HPoints.h2h_points || 0);
                    // console.log('H2H Away Points:', awayH2HPoints.h2h_points || 0);

                    

                      // Calculate predictor result
                      const result = calculatePredictor(
                        61, // Highest ranking
                        +homeTeam.FIFA_Ranking,
                        +awayTeam.FIFA_Ranking, 
                        parseFloat(homeStats.avg_caps) || 0,
                        parseFloat(awayStats.avg_caps) || 0,
                        parseFloat(homeH2HPoints.h2h_points) || 0,
                        parseFloat(awayH2HPoints.h2h_points) || 0, 
                        parseFloat(homeStats.avg_goals) || 0, 
                        parseFloat(awayStats.avg_goals) || 0  
                    );
                    // console.log(`Calculating predictor for:`, {
                    //     homeTeam: homeTeam.Team,
                    //     awayTeam: awayTeam.Team,
                    //     highestRank: 61,
                    //     homeRank: homeTeam.FIFA_Ranking,
                    //     awayRank: awayTeam.FIFA_Ranking,
                    //     avgCapsHome: homeStats?.avg_caps || 0,
                    //     avgCapsAway: awayStats?.avg_caps || 0,
                    //     h2hHome: homeH2HPoints?.h2h_points || 0,
                    //     h2hAway: awayH2HPoints?.h2h_points || 0,
                    //     avgGoalsHome: homeStats?.avg_goals || 0,
                    //     avgGoalsAway: awayStats?.avg_goals || 0,
                    // });

                    //Determine Group Outcome
                    let outcome;
                    if (result >= 1) {
                        outcome = `${homeTeam.Team} WINS`;
                        teamPoints[homeTeam.Team] += 3;
                    } else if (result <= -1) {
                        outcome = `${awayTeam.Team} WINS`;
                        teamPoints[awayTeam.Team] += 3;
                    } else {
                        outcome = 'DRAW';
                        teamPoints[homeTeam.Team] += 1;
                        teamPoints[awayTeam.Team] += 1;
                    }

                    //store result of query
                    groupResults.push({
                        home: homeTeam.Team,
                        away: awayTeam.Team,
                        result,
                        outcome
                    });
                }
            }
            allResults[groupName] = {
                //matchups: groupResults,
                teamPoints: Object.entries(teamPoints).map(([team,points]) => ({team,points}))
            }
            // console.log('Group Results:', JSON.stringify(groupResults, null, 2));
            // console.log('All Results:', JSON.stringify(allResults, null, 2));

        }
        console.log(
            'All Results:',
            JSON.stringify(allResults, null, 2) 
        );
        
        res.json(allResults);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error computing group predictions')
    }
});




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
    SUM(CASE WHEN Result = 'Win' OR Result = 'Draw' OR Result = 'Loss') AS Total
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



module.exports= router;