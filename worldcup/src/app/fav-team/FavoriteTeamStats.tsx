"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./FavoriteTeamStats.module.css";

export default function FavoriteTeamStats() {
    const [teams, setTeams] = useState([]); // List of teams fetched from the API
    const [teamName, setTeamName] = useState(""); // Selected team name
    const [teamData, setTeamData] = useState<any>(null); // Team data including flag, top scorers, caps, and player stats

    /**
     * @function useEffect - Fetches the list of teams from the API when the component mounts.
     * Updates the `teams` state with the fetched team data.
     * @author Samantha Macaluso
     */
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/teams");
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        fetchTeams();
    }, []);

    /**
     * @function handleSubmit - Handles the form submission to fetch data for the selected team.
     * Fetches the team flag, top 3 goal scorers, top 3 caps, and player statistics.
     * Updates the `teamData` state with the fetched data.
     * @param {React.FormEvent} e - The form event triggered on submission.
     * @author Samantha Macaluso
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teamName) {
            alert("Please select a team!");
            return;
        }

        try {
            // Fetch flag for the selected team
            const flagResponse = await axios.get(
                `http://localhost:3001/api/teams/${teamName.toLowerCase()}/flag`
            );

            // Fetch top 3 goal scorers for the selected team
            const scorersResponse = await axios.get(
                `http://localhost:3001/api/squads/${teamName.toLowerCase()}/top-scorers`
            );

            // Fetch top 3 caps for the selected team
            const capsResponse = await axios.get(
                `http://localhost:3001/api/squads/${teamName.toLowerCase()}/caps`
            );

            // Fetch all player statistics for the selected team
            const playersResponse = await axios.get(
                `http://localhost:3001/api/squads/${teamName.toLowerCase()}`
            );

            setTeamData({
                flag: flagResponse.data.flag || null,
                topScorers: scorersResponse.data.map((player: any) => player.Player),
                mostCaps: capsResponse.data.map((player: any) => player.Player),
                players: playersResponse.data.map((player: any) => ({
                    name: player.Player,
                    position: player.Position,
                    age: player.Age,
                    caps: player.Caps,
                    goals: player.Goals,
                })),
            });
        } catch (error) {
            console.error("Error fetching team data:", error);
            setTeamData(null);
        }
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.statsContainer}>
                <h1 className={styles.title}>Favorite Team Stats</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                        <label htmlFor="teamDropdown" className={styles.label}>
                            Select Your Team
                        </label>
                        <select
                            id="teamDropdown"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className={styles.inputField}
                        >
                            <option value="" disabled>
                                Select a team
                            </option>
                            {teams.map((team: any, index: number) => (
                                <option key={index} value={team.country_name}>
                                    {team.country_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Get Stats
                    </button>
                </form>

                {teamData && (
                    <div className={styles.results}>
                        <h2 className={styles.resultsTitle}>{teamName}</h2>
                        <div className={styles.flagSection}>
                            {teamData.flag ? (
                                <img
                                    src={teamData.flag}
                                    alt={`${teamName} Flag`}
                                    className={styles.flag}
                                />
                            ) : (
                                <p>Flag not available</p>
                            )}
                        </div>
                        <div className={styles.statsRow}>
                            <div className={styles.statsBox}>
                                <p className={styles.subTitle}>Top 3 Goal Scorers</p>
                                <ul>
                                    {teamData.topScorers.map((scorer: string, index: number) => (
                                        <li key={index}>{scorer}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.statsBox}>
                                <p className={styles.subTitle}>Top 3 Caps</p>
                                <ul>
                                    {teamData.mostCaps.map((player: string, index: number) => (
                                        <li key={index}>{player}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.sophisticatedStats}>
                            <h3 className={styles.subTitle}>Player Statistics</h3>
                            <ul>
                                {teamData.players.map((player: any, index: number) => (
                                    <li key={index}>
                                        {player.name} - {player.position}, Age: {player.age}, Caps:{" "}
                                        {player.caps}, Goals: {player.goals}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
