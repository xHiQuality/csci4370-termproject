SELECT 
    Team1 AS Team,
    SUM(CASE WHEN Result = 'Win' THEN 1 ELSE 0 END) AS Wins,
    SUM(CASE WHEN Result = 'Draw' THEN 1 ELSE 0 END) AS Draws,
    SUM(CASE WHEN Result = 'Loss' THEN 1 ELSE 0 END) AS Losses
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
        (Home_Team = 'France' AND Away_Team = 'Denmark')
        OR 
        (Home_Team = 'Denmark' AND Away_Team = 'France')

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
        (Home_Team = 'France' AND Away_Team = 'Denmark')
        OR 
        (Home_Team = 'Denmark' AND Away_Team = 'France')
) AS CombinedResults
GROUP BY Team1;
