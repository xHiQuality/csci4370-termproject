"use client";

import React, { useState } from "react";
import styles from "./FavoriteTeamStats.module.css";

export default function FavoriteTeamStats() {
    const [teamName, setTeamName] = useState("");
    const [teamData, setTeamData] = useState<any>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate fetching team stats with mock data
        const mockData = {
            squad: "Squad information about players and roles. Example: Forward, Midfield.",
            players: [
                { name: "Player A", position: "Forward", goals: 10 },
                { name: "Player B", position: "Midfield", assists: 8 },
            ],
            clubs: [
                { name: "Club A", location: "City A" },
                { name: "Club B", location: "City B" },
            ],
            performance: {
                tournamentsPlayed: 5,
                bestFinish: "Semifinals",
                recentPerformance: "Won last 3 matches",
            },
        };

        setTeamData(mockData);
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.statsContainer}>
                <h1 className={styles.title}>Favorite Team Stats</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                        <label htmlFor="teamName" className={styles.label}>
                            Team Name
                        </label>
                        <input
                            id="teamName"
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name"
                            className={styles.inputField}
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Get Stats
                    </button>
                </form>

                {teamData && (
                    <div className={styles.results}>
                        <h2 className={styles.resultsTitle}>Team Statistics</h2>
                        <p>
                            <strong>Squad:</strong> {teamData.squad}
                        </p>
                        <h3 className={styles.subTitle}>Players:</h3>
                        <ul>
                            {teamData.players.map((player: any, index: number) => (
                                <li key={index}>
                                    <strong>{player.name}</strong> - Position: {player.position},{" "}
                                    {player.goals ? `Goals: ${player.goals}` : `Assists: ${player.assists}`}
                                </li>
                            ))}
                        </ul>
                        <h3 className={styles.subTitle}>Clubs:</h3>
                        <ul>
                            {teamData.clubs.map((club: any, index: number) => (
                                <li key={index}>
                                    <strong>{club.name}</strong> - Location: {club.location}
                                </li>
                            ))}
                        </ul>
                        <h3 className={styles.subTitle}>Performance:</h3>
                        <p>
                            <strong>Tournaments Played:</strong> {teamData.performance.tournamentsPlayed}
                        </p>
                        <p>
                            <strong>Best Finish:</strong> {teamData.performance.bestFinish}
                        </p>
                        <p>
                            <strong>Recent Performance:</strong> {teamData.performance.recentPerformance}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
