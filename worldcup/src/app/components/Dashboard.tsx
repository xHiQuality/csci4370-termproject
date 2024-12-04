"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [comparisonData, setComparisonData] = useState<any>(null);
    const router = useRouter();

    const teams = ["Team A", "Team B", "Team C", "Team D"]; // Mock teams for dropdown

    const handleCompare = (e: React.FormEvent) => {
        e.preventDefault();

        // Mock data for comparison
        const mockData = {
            teamA: {
                flag: "🇦🇷",
                group: "Group A",
                ranking: "#5",
            },
            teamB: {
                flag: "🇧🇷",
                group: "Group B",
                ranking: "#10",
            },
            history: {
                matchesPlayed: 10,
                teamAWins: 6,
                teamBWins: 4,
            },
        };

        setComparisonData(mockData);
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>World Cup Queries</h1>
                <button
                    className={styles.favoriteTeamButton}
                    onClick={() => router.push("/fav-team")}
                >
                    My Favorite Team
                </button>
            </header>
            <form onSubmit={handleCompare} className={styles.form}>
                <div className={styles.teamSelectors}>
                    <select
                        value={teamA}
                        onChange={(e) => setTeamA(e.target.value)}
                        className={styles.teamDropdown}
                    >
                        <option value="" disabled>
                            Select Team A
                        </option>
                        {teams.map((team, index) => (
                            <option key={index} value={team}>
                                {team}
                            </option>
                        ))}
                    </select>
                    <select
                        value={teamB}
                        onChange={(e) => setTeamB(e.target.value)}
                        className={styles.teamDropdown}
                    >
                        <option value="" disabled>
                            Select Team B
                        </option>
                        {teams.map((team, index) => (
                            <option key={index} value={team}>
                                {team}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className={styles.compareButton}>
                        Compare
                    </button>
                </div>
            </form>
            {comparisonData && (
                <div className={styles.resultsContainer}>
                    <div className={styles.flagRow}>
                        <div className={styles.teamBox}>
                            <p className={styles.flag}>{comparisonData.teamA.flag}</p>
                            <p className={styles.teamName}>{teamA}</p>
                        </div>
                        <div className={styles.teamBox}>
                            <p className={styles.flag}>{comparisonData.teamB.flag}</p>
                            <p className={styles.teamName}>{teamB}</p>
                        </div>
                    </div>
                    <div className={styles.statsRow}>
                        <div className={styles.statsBox}>
                            <h3 className={styles.subTitle}>Head-to-Head History</h3>
                            <p>
                                {teamA} and {teamB} have played{" "}
                                {comparisonData.history.matchesPlayed} matches.
                            </p>
                            <p>
                                {teamA} won {comparisonData.history.teamAWins}, and {teamB} won{" "}
                                {comparisonData.history.teamBWins}.
                            </p>
                        </div>
                        <div className={styles.statsBox}>
                            <h3 className={styles.subTitle}>Group Information</h3>
                            <p>
                                {teamA}: {comparisonData.teamA.group}
                            </p>
                            <p>
                                {teamB}: {comparisonData.teamB.group}
                            </p>
                        </div>
                        <div className={styles.statsBox}>
                            <h3 className={styles.subTitle}>FIFA Rankings</h3>
                            <p>
                                {teamA}: {comparisonData.teamA.ranking}
                            </p>
                            <p>
                                {teamB}: {comparisonData.teamB.ranking}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
