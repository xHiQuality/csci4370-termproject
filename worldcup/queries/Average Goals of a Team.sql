SELECT Team, AVG(Goals) AS AverageGoals
FROM squads_2022s
WHERE Team = 'France'
  AND Position IN ('Forward', 'Midfielder');
