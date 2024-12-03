"use client";

import React, { useState } from "react";
import styles from "./FavoriteTeamStats.module.css";

export default function FavoriteTeamStats() {
    const [teamName, setTeamName] = useState("");
    const [teamData, setTeamData] = useState<any>(null);

    const teams = ["Team A", "Team B", "Team C", "Team D"]; // Mock teams for dropdown

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mock data to simulate fetching team stats
        const mockData = {
            flag: "🏳️",
            topScorers: ["Player 1", "Player 2", "Player 3"],
            mostCaps: ["Player A", "Player B", "Player C"],
            players: [
                { name: "Player A", position: "Forward", age: 28, caps: 100, goals: 45 },
                { name: "Player B", position: "Midfielder", age: 25, caps: 80, goals: 20 },
                { name: "Player C", position: "Defender", age: 30, caps: 110, goals: 10 },
            ],
        };

        setTeamData(mockData);
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
                                Choose a team
                            </option>
                            {teams.map((team, index) => (
                                <option key={index} value={team}>
                                    {team}
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
                            <span className={styles.flag}>{teamData.flag}</span>
                        </div>
                        <div className={styles.statsRow}>
                            <div className={styles.statsBox}>
                                <p className={styles.subTitle}>Top 3 Goal Scorers</p>
                                <ul>
                                    {teamData.topScorers.map((scorer, index) => (
                                        <li key={index}>{scorer}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.statsBox}>
                                <p className={styles.subTitle}>Top 3 Caps</p>
                                <ul>
                                    {teamData.mostCaps.map((player, index) => (
                                        <li key={index}>{player}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.sophisticatedStats}>
                            <h3 className={styles.subTitle}>Player Statistics</h3>
                            <ul>
                                {teamData.players.map((player, index) => (
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
