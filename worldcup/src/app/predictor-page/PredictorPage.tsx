"use client";

import { useState } from "react";
import styles from "./PredictorPage.module.css";

export default function PredictorPage() {
    const [showBracket, setShowBracket] = useState(false);

    // Mock data
    const groups = {
        GroupA: ["Team 1", "Team 2", "Team 3", "Team 4"],
        GroupB: ["Team 5", "Team 6", "Team 7", "Team 8"],
    };

    const bracket = [
        { match: "Quarterfinal 1", team1: "Team 1", team2: "Team 8", winner: "Team 1" },
        { match: "Quarterfinal 2", team1: "Team 5", team2: "Team 4", winner: "Team 4" },
        { match: "Quarterfinal 3", team1: "Team 6", team2: "Team 3", winner: "Team 6" },
        { match: "Quarterfinal 4", team1: "Team 2", team2: "Team 7", winner: "Team 7" },
    ];

    const semiFinals = [
        { match: "Semifinal 1", team1: "Team 1", team2: "Team 6", winner: "Team 1" },
        { match: "Semifinal 2", team1: "Team 4", team2: "Team 7", winner: "Team 7" },
    ];

    const finals = { match: "Final", team1: "Team 1", team2: "Team 7", winner: "Team 1" };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Predictor Page</h1>
            <p className={styles.description}>
                This predictor model takes data such as groups, FIFA rankings, and historical performance to simulate the World Cup brackets.
            </p>

            {/* Group Stage */}
            <div className={styles.groupsContainer}>
                <h2 className={styles.subTitle}>Group Stage</h2>
                {Object.entries(groups).map(([groupName, teams]) => (
                    <div key={groupName} className={styles.groupBox}>
                        <h3 className={styles.groupTitle}>{groupName}</h3>
                        <ul className={styles.teamList}>
                            {teams.map((team, index) => (
                                <li key={index} className={styles.teamItem}>
                                    {team}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bracket Simulation */}
            {showBracket && (
                <div className={styles.bracketContainer}>
                    <h2 className={styles.subTitle}>Bracket Simulation</h2>

                    {/* Quarterfinals */}
                    <div className={styles.roundContainer}>
                        <h3 className={styles.roundTitle}>Quarterfinals</h3>
                        {bracket.map((match, index) => (
                            <div key={index} className={styles.matchBox}>
                                <p>
                                    {match.team1} vs {match.team2}
                                </p>
                                <p className={styles.winner}>Winner: {match.winner}</p>
                            </div>
                        ))}
                    </div>

                    {/* Semifinals */}
                    <div className={styles.roundContainer}>
                        <h3 className={styles.roundTitle}>Semifinals</h3>
                        {semiFinals.map((match, index) => (
                            <div key={index} className={styles.matchBox}>
                                <p>
                                    {match.team1} vs {match.team2}
                                </p>
                                <p className={styles.winner}>Winner: {match.winner}</p>
                            </div>
                        ))}
                    </div>

                    {/* Final */}
                    <div className={styles.roundContainer}>
                        <h3 className={styles.roundTitle}>Final</h3>
                        <div className={styles.matchBox}>
                            <p>
                                {finals.team1} vs {finals.team2}
                            </p>
                            <p className={styles.winner}>Winner: {finals.winner}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Show Bracket Button */}
            <button
                className={styles.startButton}
                onClick={() => setShowBracket(!showBracket)}
            >
                {showBracket ? "Hide Bracket" : "Simulate Bracket"}
            </button>
        </div>
    );
}
