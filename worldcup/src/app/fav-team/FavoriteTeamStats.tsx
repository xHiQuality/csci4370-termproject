"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./FavoriteTeamStats.module.css";

export default function FavoriteTeamStats() {
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [teamData, setTeamData] = useState<any>(null);

    useEffect(() => {
        // Fetch teams from the API
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teamName) {
            alert("Please select a team!");
            return;
        }

        try {
            // Fetch flag for the selected team
            const response = await axios.get(`http://localhost:3001/api/teams/${teamName.toLowerCase()}/flag`);
            setTeamData({
                flag: response.data.flag || null, // Use the flag from the API or null
                topScorers: ["Player 1", "Player 2", "Player 3"], // Placeholder data
                mostCaps: ["Player A", "Player B", "Player C"], // Placeholder data
                players: [
                    { name: "Player A", position: "Forward", age: 28, caps: 100, goals: 45 },
                    { name: "Player B", position: "Midfielder", age: 25, caps: 80, goals: 20 },
                    { name: "Player C", position: "Defender", age: 30, caps: 110, goals: 10 },
                ], // Placeholder data
            });
        } catch (error) {
            console.error("Error fetching team flag:", error);
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
