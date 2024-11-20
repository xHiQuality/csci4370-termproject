    "use client";

    import Link from "next/link";
import { useState } from "react";
import styles from "./Dashboard.module.css";

    export default function Dashboard() {
    // State to simulate authentication
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // State for selected teams and results
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");
    const [comparisonResult, setComparisonResult] = useState<{
        headToHeadWinPercentage: string;
        team1Wins: number;
        team2Wins: number;
    } | null>(null);

    const teams = ["Team A", "Team B", "Team C", "Team D"]; // Example team names

    const handleCompare = () => {
        if (team1 && team2 && team1 !== team2) {
        // Simulated comparison logic (replace with real data fetching)
        const result = {
            headToHeadWinPercentage: `${Math.floor(Math.random() * 100)}%`,
            team1Wins: Math.floor(Math.random() * 10),
            team2Wins: Math.floor(Math.random() * 10),
        };
        setComparisonResult(result);
        } else {
        alert("Please select two different teams.");
        }
    };

    return (
        <div className={styles.dashboardContainer}>
        {isLoggedIn ? (
            <>
            <header className={styles.header}>
                <h1 className={`pixelated-text ${styles.title}`}>World Cup Queries</h1>
                <Link href="/" className={`pixelated-text ${styles.logoutButton}`}>
                Log out
                </Link>
            </header>

            <section className={styles.teamComparisonSection}>
            <h2 className={`pixelated-text ${styles.gamesTitle}`}>Compare Teams</h2>

                <div className={styles.teamSelectors}>
                <select
                    className={styles.teamDropdown}
                    value={team1}
                    onChange={(e) => setTeam1(e.target.value)}
                >
                    <option value="">Select Team 1</option>
                    {teams.map((team, index) => (
                    <option key={index} value={team}>
                        {team}
                    </option>
                    ))}
                </select>
                <select
                    className={styles.teamDropdown}
                    value={team2}
                    onChange={(e) => setTeam2(e.target.value)}
                >
                    <option value="">Select Team 2</option>
                    {teams.map((team, index) => (
                    <option key={index} value={team}>
                        {team}
                    </option>
                    ))}
                </select>
                <button
                    onClick={handleCompare}
                    className={`pixelated-text ${styles.compareButton}`}
                >
                    Compare
                </button>
                </div>
                {comparisonResult && (
                <div className={styles.resultsContainer}>
                    <p className={`pixelated-text`}>
                    Head-to-Head Win Percentage:{" "}
                    {comparisonResult.headToHeadWinPercentage}
                    </p>
                    <p className={`pixelated-text`}>
                    {team1} Wins: {comparisonResult.team1Wins}
                    </p>
                    <p className={`pixelated-text`}>
                    {team2} Wins: {comparisonResult.team2Wins}
                    </p>
                </div>
                )}
            </section>
            </>
        ) : (
            <p className={`pixelated-text ${styles.notLoggedInMessage}`}>
            You are not logged in. Please log in to access the dashboard.
            </p>
        )}
        </div>
    );
    }
