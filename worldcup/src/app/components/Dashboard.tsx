"use client";

import axios from 'axios';
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const [selectedTeamA, setSelectedTeamA] = useState("");
    const [selectedTeamB, setSelectedTeamB] = useState("");
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [teams, setTeams] = useState<string[]>([]); // Teams from the database
    const [flags, setFlags] = useState<{ [key: string]: string }>({}); // Store flags by team name
    const [groupInfo, setGroupInfo] = useState<{ [key: string]: string }>({}); // Store group info by team name
    const [fifaRankings, setFifaRankings] = useState<{ [key: string]: number }>({}); // Store FIFA ranking by team name

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
        // Fetch flag, group info, and FIFA rankings for Team A
        const fetchInfoForTeamA = async () => {
            if (selectedTeamA) {
                try {
                    // Fetch flag
                    const flagResponse = await axios.get(
                        `http://localhost:3001/api/teams/${selectedTeamA.toLowerCase()}/flag`
                    );
                    setFlags((prevFlags) => ({
                        ...prevFlags,
                        [selectedTeamA]: flagResponse.data.flag,
                    }));

                    // Fetch group info and FIFA ranking
                    const infoResponse = await axios.get(
                        `http://localhost:3001/api/compare/info/${selectedTeamA}`
                    );
                    setGroupInfo((prevGroupInfo) => ({
                        ...prevGroupInfo,
                        [selectedTeamA]: infoResponse.data[0]?.Group || "N/A",
                    }));
                    setFifaRankings((prevRankings) => ({
                        ...prevRankings,
                        [selectedTeamA]: infoResponse.data[0]?.FIFA_Ranking || "N/A",
                    }));
                } catch (error) {
                    console.error(`Error fetching info for ${selectedTeamA}:`, error);
                }
            }
        };

        // Fetch flag, group info, and FIFA rankings for Team B
        const fetchInfoForTeamB = async () => {
            if (selectedTeamB) {
                try {
                    // Fetch flag
                    const flagResponse = await axios.get(
                        `http://localhost:3001/api/teams/${selectedTeamB.toLowerCase()}/flag`
                    );
                    setFlags((prevFlags) => ({
                        ...prevFlags,
                        [selectedTeamB]: flagResponse.data.flag,
                    }));

                    // Fetch group info and FIFA ranking
                    const infoResponse = await axios.get(
                        `http://localhost:3001/api/compare/info/${selectedTeamB}`
                    );
                    setGroupInfo((prevGroupInfo) => ({
                        ...prevGroupInfo,
                        [selectedTeamB]: infoResponse.data[0]?.Group || "N/A",
                    }));
                    setFifaRankings((prevRankings) => ({
                        ...prevRankings,
                        [selectedTeamB]: infoResponse.data[0]?.FIFA_Ranking || "N/A",
                    }));
                } catch (error) {
                    console.error(`Error fetching info for ${selectedTeamB}:`, error);
                }
            }
        };

        fetchInfoForTeamA();
        fetchInfoForTeamB();
    }, [selectedTeamA, selectedTeamB]);

    const handleCompare = () => {
        // Mock data for comparison
        const mockData = {
            headToHeadHistory:
                `${selectedTeamA} and ${selectedTeamB} have played 10 matches. ${selectedTeamA} won 6, and ${selectedTeamB} won 4.`,
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
                                    {selectedTeamA}: {groupInfo[selectedTeamA] || "N/A"}
                                </p>
                                <p>
                                    {selectedTeamB}: {groupInfo[selectedTeamB] || "N/A"}
                                </p>
                            </div>
                            <div className={styles.statsBox}>
                                <h4>FIFA Rankings</h4>
                                <p>
                                    {selectedTeamA}: {fifaRankings[selectedTeamA] || "N/A"}
                                </p>
                                <p>
                                    {selectedTeamB}: {fifaRankings[selectedTeamB] || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
