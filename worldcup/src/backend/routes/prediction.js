const express = require('express');
const pool = require('../db/connection2.js');
const router = express.Router();

//Formula Logic
const calculatePredictor = (highestRank,homeRank,awayRank,avgCapsHome,avgCapsAway,h2hHome,h2hAway,avgGoalsHome,avgGoalsAway) => {
    const randomValue = Math.random() * 60 - 30;
    return 0.4 * ((highestRank - homeRank) + (awayRank - highestRank)) +
        0.05 * (avgCapsHome - avgCapsAway) +
        0.1 * (h2hHome - h2hAway) +
        0.05 * (avgGoalsHome - avgGoalsAway) +
        .4 * randomValue;

};

//API endpoint for group predictions
router.get('/all-group-predictions', async (req,res) => {
    try {
        
        //group Names
        const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        //console.log(groups)

        const allResults = {};
        const topTwoSeeds = [];

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

            // Sort teams by points in descending order
            let sortedTeamPoints = Object.entries(teamPoints)
                .map(([team, points]) => ({ team, points }))
                .sort((a, b) => b.points - a.points);

                sortedTeamPoints = sortedTeamPoints.reduce((acc, teamObj, idx, arr) => {
                    if (idx > 0 && teamObj.points === arr[idx - 1].points) {
                        // Coin flip for teams with the same points
                        const coinFlip = Math.random() > 0.5 ? 1 : -1;
                        if (coinFlip > 0) {
                            acc.push(teamObj); // Push current team as is
                        } else {
                            
                            const previousTeam = acc.pop();
                            acc.push(teamObj, previousTeam);
                        }
                    } else {
                        acc.push(teamObj);
                    }
                    return acc;
                }, []);

                sortedTeamPoints.forEach((teamObj, index) => {
                    teamObj.seed = `${index + 1}${groupName}`;
                });


            topTwoSeeds.push(sortedTeamPoints[0], sortedTeamPoints[1]);
            console.log(topTwoSeeds)

            allResults[groupName] = {
                //matchups: groupResults,
                teamPoints: sortedTeamPoints
            }
            // console.log('Group Results:', JSON.stringify(groupResults, null, 2));
            // console.log('All Results:', JSON.stringify(allResults, null, 2));

        }

        // Simulate Round of 16
        const roundOf16Matchups = [
            { home: '1A', away: '2B' },
            { home: '1C', away: '2D' },
            { home: '1B', away: '2A' },
            { home: '1D', away: '2C' },
            { home: '1E', away: '2F' },
            { home: '1G', away: '2H' },
            { home: '1F', away: '2E' },
            { home: '1H', away: '2G' },
        ];

        const findTeam = (seed) => {
            return topTwoSeeds.find((teamObj) => teamObj.seed === seed);
        };

        const roundOf16Results = [];
        const quarterFinalSeeds = [];
        const semiFinalSeeds = [];
        const finalSeeds = [];

        for (const matchup of roundOf16Matchups) {
            const homeTeam = findTeam(matchup.home);
            const awayTeam = findTeam(matchup.away);

            const [[homeFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [homeTeam.team]
            )

            const [[awayFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [awayTeam.team]
            )

            const [[homeStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [homeTeam.team]
            );
            const [[awayStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [awayTeam.team]
            );

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
                    homeTeam.team,
                    homeTeam.team, 
                    homeTeam.team, 
                    homeTeam.team, 
                    homeTeam.team, awayTeam.team,
                    awayTeam.team, homeTeam.team  
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
                    awayTeam.team, 
                    awayTeam.team, 
                    awayTeam.team, 
                    homeTeam.team, awayTeam.team, 
                    awayTeam.team, homeTeam.team  
                ]
            ) || [{}];

            const result = calculatePredictor(
                61, // Highest ranking
                homeFifaRanking.FIFA_Ranking,
                awayFifaRanking.FIFA_Ranking, 
                parseFloat(homeStats.avg_caps) || 0,
                parseFloat(awayStats.avg_caps) || 0,
                parseFloat(homeH2HPoints.h2h_points) || 0,
                parseFloat(awayH2HPoints.h2h_points) || 0, 
                parseFloat(homeStats.avg_goals) || 0, 
                parseFloat(awayStats.avg_goals) || 0  
            );
            // console.log(`Calculating predictor for:`, {
            //             homeTeam: homeTeam.team,
            //             awayTeam: awayTeam.team,
            //             highestRank: 61,
            //             homeRank: homeFifaRanking.FIFA_Ranking,
            //             awayRank: awayFifaRanking.FIFA_Ranking,
            //             avgCapsHome: homeStats?.avg_caps || 0,
            //             avgCapsAway: awayStats?.avg_caps || 0,
            //             h2hHome: homeH2HPoints?.h2h_points || 0,
            //             h2hAway: awayH2HPoints?.h2h_points || 0,
            //             avgGoalsHome: homeStats?.avg_goals || 0,
            //             avgGoalsAway: awayStats?.avg_goals || 0,
            //         });

            const winner = result >= 0 ? homeTeam.team : awayTeam.team;

            roundOf16Results.push({
                matchup: `${homeTeam.seed} vs ${awayTeam.seed}`,
                winner
            });
            quarterFinalSeeds.push(winner);
        }
        
        const quarterFinalMatchups = [
            { home: quarterFinalSeeds[0], away: quarterFinalSeeds[1] },
            { home: quarterFinalSeeds[2], away: quarterFinalSeeds[3] },
            { home: quarterFinalSeeds[4], away: quarterFinalSeeds[5] },
            { home: quarterFinalSeeds[6], away: quarterFinalSeeds[7] },
        ];
        console.log(quarterFinalMatchups)

        const quarterFinalResults = [];
        for (const matchup of quarterFinalMatchups) {
            const homeTeam = matchup.home;
            const awayTeam = matchup.away;

            const [[homeFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [homeTeam]
            )

            const [[awayFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [awayTeam]
            )

            const [[homeStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [homeTeam]
            );
            const [[awayStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [awayTeam]
            );

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
                    homeTeam,
                    homeTeam, 
                    homeTeam, 
                    homeTeam, 
                    homeTeam, awayTeam,
                    awayTeam, homeTeam 
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
                    awayTeam, 
                    awayTeam, 
                    awayTeam, 
                    awayTeam, 
                    homeTeam, awayTeam, 
                    awayTeam, homeTeam 
                ]
            ) || [{}];

            const result = calculatePredictor(
                61, // Highest ranking
                homeFifaRanking.FIFA_Ranking,
                awayFifaRanking.FIFA_Ranking, 
                parseFloat(homeStats.avg_caps) || 0,
                parseFloat(awayStats.avg_caps) || 0,
                parseFloat(homeH2HPoints.h2h_points) || 0,
                parseFloat(awayH2HPoints.h2h_points) || 0, 
                parseFloat(homeStats.avg_goals) || 0, 
                parseFloat(awayStats.avg_goals) || 0  
            );

            const winner = result >= 0 ? homeTeam : awayTeam;
            quarterFinalResults.push({
                winner
            });
            semiFinalSeeds.push(winner);
        }
        const semiFinalMatchups = [
            { home: semiFinalSeeds[0], away: semiFinalSeeds[1] },
            { home: semiFinalSeeds[2], away: semiFinalSeeds[3] }
        ];
        
        const semiFinalResults = [];
        for (const matchup of semiFinalMatchups) {
            const homeTeam = matchup.home;
            const awayTeam = matchup.away;

            const [[homeFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [homeTeam]
            )

            const [[awayFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [awayTeam]
            )

            const [[homeStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [homeTeam]
            );
            const [[awayStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [awayTeam]
            );

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
                    homeTeam,
                    homeTeam, 
                    homeTeam, 
                    homeTeam, 
                    homeTeam, awayTeam,
                    awayTeam, homeTeam  
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
                    awayTeam, 
                    awayTeam, 
                    awayTeam, 
                    awayTeam, 
                    homeTeam, awayTeam, 
                    awayTeam, homeTeam  
                ]
            ) || [{}];

            const result = calculatePredictor(
                61, // Highest ranking
                homeFifaRanking.FIFA_Ranking,
                awayFifaRanking.FIFA_Ranking, 
                parseFloat(homeStats.avg_caps) || 0,
                parseFloat(awayStats.avg_caps) || 0,
                parseFloat(homeH2HPoints.h2h_points) || 0,
                parseFloat(awayH2HPoints.h2h_points) || 0, 
                parseFloat(homeStats.avg_goals) || 0, 
                parseFloat(awayStats.avg_goals) || 0  
            );

            const winner = result >= 0 ? homeTeam : awayTeam;
            semiFinalResults.push({
                winner
            });
            finalSeeds.push(winner);
        }
        const champion = [];
        const finalMatchups = [
            { home: semiFinalSeeds[0], away: semiFinalSeeds[1] }
        ];
        const finalResults = [];
        for (const matchup of finalMatchups) {
            const homeTeam = matchup.home;
            const awayTeam = matchup.away;

            const [[homeFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [homeTeam]
            )

            const [[awayFifaRanking]] = await pool.query(
                `SELECT FIFA_Ranking from world_cup_groups_2022s WHERE Team = ?;`,
                [awayTeam]
            )

            const [[homeStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [homeTeam]
            );
            const [[awayStats]] = await pool.query(
                `SELECT AVG(Caps) AS avg_caps, AVG(Goals) AS avg_goals
                 FROM squads_2022s WHERE Team = ? AND Position IN ('Forward','Midfielder')`,
                [awayTeam]
            );

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
                    homeTeam,
                    homeTeam, 
                    homeTeam, 
                    homeTeam, 
                    homeTeam, awayTeam,
                    awayTeam, homeTeam  
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
                    awayTeam, 
                    awayTeam, 
                    awayTeam, 
                    awayTeam, 
                    homeTeam, awayTeam, 
                    awayTeam, homeTeam  
                ]
            ) || [{}];

            const result = calculatePredictor(
                61, // Highest ranking
                homeFifaRanking.FIFA_Ranking,
                awayFifaRanking.FIFA_Ranking, 
                parseFloat(homeStats.avg_caps) || 0,
                parseFloat(awayStats.avg_caps) || 0,
                parseFloat(homeH2HPoints.h2h_points) || 0,
                parseFloat(awayH2HPoints.h2h_points) || 0, 
                parseFloat(homeStats.avg_goals) || 0, 
                parseFloat(awayStats.avg_goals) || 0  
            );

            const winner = result >= 0 ? homeTeam : awayTeam;
            finalResults.push({
                winner
            });
            champion.push(winner);
        }
        
        res.json({
            groupResults: allResults,
            topTwoSeeds,
            roundOf16Results,
            quarterFinalMatchups,
            quarterFinalResults,
            semiFinalMatchups,
            semiFinalResults,
            finalMatchups,
            finalResults,
            champion
        });

        console.log(
            'All Results:',
            JSON.stringify(allResults, null, 2)
        );
        console.log('Round of 16:',
            JSON.stringify(roundOf16Results,null,2)
        )
        console.log('Quater Finals:',
            JSON.stringify(quarterFinalResults,null,2)
        )
        console.log('Semi Finals:',
            JSON.stringify(semiFinalResults,null,2)
        )
        console.log('Finals:',
            JSON.stringify(finalResults,null,2)
        )
        console.log('Champion:',
            JSON.stringify(champion,null,2)
        )
        
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