"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const [selectedTeamA, setSelectedTeamA] = useState("");
    const [selectedTeamB, setSelectedTeamB] = useState("");
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [teams, setTeams] = useState<string[]>([]); // Teams from the database
    const [flags, setFlags] = useState<{ [key: string]: string }>({}); // Store flags by team name

    useEffect(() => {
        // Fetch teams from the API
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/teams");
                const teamNames = response.data.map((team: any) => team.country_name);
                setTeams(teamNames);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        // Fetch flag for Team A
        const fetchFlagForTeamA = async () => {
            if (selectedTeamA) {
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/teams/${selectedTeamA.toLowerCase()}/flag`
                    );
                    setFlags((prevFlags) => ({
                        ...prevFlags,
                        [selectedTeamA]: response.data.flag,
                    }));
                } catch (error) {
                    console.error(`Error fetching flag for ${selectedTeamA}:`, error);
                }
            }
        };

        // Fetch flag for Team B
        const fetchFlagForTeamB = async () => {
            if (selectedTeamB) {
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/teams/${selectedTeamB.toLowerCase()}/flag`
                    );
                    setFlags((prevFlags) => ({
                        ...prevFlags,
                        [selectedTeamB]: response.data.flag,
                    }));
                } catch (error) {
                    console.error(`Error fetching flag for ${selectedTeamB}:`, error);
                }
            }
        };

        fetchFlagForTeamA();
        fetchFlagForTeamB();
    }, [selectedTeamA, selectedTeamB]);

    const handleCompare = () => {
        // Mock data for comparison
        const mockData = {
            headToHeadHistory:
                `${selectedTeamA} and ${selectedTeamB} have played 10 matches. ${selectedTeamA} won 6, and ${selectedTeamB} won 4.`,
            groupInfo: { teamA: "Group A", teamB: "Group B" },
            fifaRankings: { teamA: "#5", teamB: "#10" },
        };

        setComparisonData(mockData);
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>World Cup Queries</h1>
                <div className={styles.buttons}>
                    <button
                        onClick={() => (window.location.href = "/fav-team")}
                        className={styles.favoriteTeamButton}
                    >
                        My Favorite Team
                    </button>
                    <button
                        onClick={() => (window.location.href = "/predictor-page")}
                        className={styles.predictorButton}
                    >
                        Predictor Page
                    </button>
                </div>
            </header>
            <div className={styles.teamComparisonSection}>
                <h2 className={styles.gamesTitle}>Compare Teams</h2>
                <div className={styles.teamSelectors}>
                    <select
                        value={selectedTeamA}
                        onChange={(e) => setSelectedTeamA(e.target.value)}
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
                        value={selectedTeamB}
                        onChange={(e) => setSelectedTeamB(e.target.value)}
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
                    <button onClick={handleCompare} className={styles.compareButton}>
                        Compare
                    </button>
                </div>
                {comparisonData && (
                    <div className={styles.resultsContainer}>
                        <div className={styles.teamHeaders}>
                            <div className={styles.teamCard}>
                                {flags[selectedTeamA] ? (
                                    <img
                                        src={flags[selectedTeamA]}
                                        alt={`${selectedTeamA} Flag`}
                                        className={styles.flag}
                                    />
                                ) : (
                                    <p>Flag not available</p>
                                )}
                                <h3>{selectedTeamA}</h3>
                            </div>
                            <div className={styles.teamCard}>
                                {flags[selectedTeamB] ? (
                                    <img
                                        src={flags[selectedTeamB]}
                                        alt={`${selectedTeamB} Flag`}
                                        className={styles.flag}
                                    />
                                ) : (
                                    <p>Flag not available</p>
                                )}
                                <h3>{selectedTeamB}</h3>
                            </div>
                        </div>
                        <div className={styles.statsRow}>
                            <div className={styles.statsBox}>
                                <h4>Head-to-Head History</h4>
                                <p>{comparisonData.headToHeadHistory}</p>
                            </div>
                            <div className={styles.statsBox}>
                                <h4>Group Information</h4>
                                <p>
                                    {selectedTeamA}: {comparisonData.groupInfo.teamA}
                                </p>
                                <p>
                                    {selectedTeamB}: {comparisonData.groupInfo.teamB}
                                </p>
                            </div>
                            <div className={styles.statsBox}>
                                <h4>FIFA Rankings</h4>
                                <p>
                                    {selectedTeamA}: {comparisonData.fifaRankings.teamA}
                                </p>
                                <p>
                                    {selectedTeamB}: {comparisonData.fifaRankings.teamB}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
