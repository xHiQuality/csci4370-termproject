"use client";

import { useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [selectedTeamA, setSelectedTeamA] = useState("");
  const [selectedTeamB, setSelectedTeamB] = useState("");
  const [comparisonData, setComparisonData] = useState<any>(null);

  const teams = ["Team A", "Team B", "Team C", "Team D"]; // Mock teams

  const handleCompare = () => {
    // Mock data for comparison
    const mockData = {
      headToHeadHistory: "Team A and Team B have played 10 matches. Team A won 6, and Team B won 4.",
      groupInfo: { teamA: "Group A", teamB: "Group B" },
      fifaRankings: { teamA: "#5", teamB: "#10" },
      flags: { teamA: "🇦🇷", teamB: "🇧🇷" }, // Dummy flags
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
                <p className={styles.flag}>{comparisonData.flags.teamA}</p>
                <h3>{selectedTeamA}</h3>
              </div>
              <div className={styles.teamCard}>
                <p className={styles.flag}>{comparisonData.flags.teamB}</p>
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
