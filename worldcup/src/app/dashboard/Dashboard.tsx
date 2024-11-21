"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [comparisonResult, setComparisonResult] = useState<any>(null);

    const handleCompare = () => {

        const mockResult = {
            headToHeadWinPercentage: "20%",
            teamAWins: 2,
            teamBWins: 8,
        };
        setComparisonResult(mockResult);
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>World Cup Queries</h1>
                <Link href="/" className={styles.logoutButton}>
                    Log out
                </Link>
            </header>
            <section className={styles.teamComparisonSection}>
                <Link href="/fav-team" className={styles.favoriteTeamButton}>
                    My Favorite Team
                </Link>
                <h2 className={styles.gamesTitle}>Compare Teams</h2>
                <div className={styles.teamSelectors}>
                    <select
                        value={teamA}
                        onChange={(e) => setTeamA(e.target.value)}
                        className={styles.teamDropdown}
                    >
                        <option value="">Team A</option>
                        <option value="Team1">Team 1</option>
                        <option value="Team2">Team 2</option>
                    </select>
                    <select
                        value={teamB}
                        onChange={(e) => setTeamB(e.target.value)}
                        className={styles.teamDropdown}
                    >
                        <option value="">Team B</option>
                        <option value="Team3">Team 3</option>
                        <option value="Team4">Team 4</option>
                    </select>
                    <button onClick={handleCompare} className={styles.compareButton}>
                        Compare
                    </button>
                </div>
                {comparisonResult && (
                    <div className={styles.resultsContainer}>
                        <p>
                            <strong>Head-to-Head Win Percentage:</strong>{" "}
                            {comparisonResult.headToHeadWinPercentage}
                        </p>
                        <p>
                            <strong>Team A Wins:</strong> {comparisonResult.teamAWins}
                        </p>
                        <p>
                            <strong>Team B Wins:</strong> {comparisonResult.teamBWins}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
