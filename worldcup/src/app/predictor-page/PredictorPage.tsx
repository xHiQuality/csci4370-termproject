"use client";

import { useState } from "react";
import styles from "./PredictorPage.module.css";

export default function PredictorPage() {
    const groups = [
        { groupName: "Group A", teams: ["Team A1", "Team A2", "Team A3", "Team A4"] },
        { groupName: "Group B", teams: ["Team B1", "Team B2", "Team B3", "Team B4"] },
        { groupName: "Group C", teams: ["Team C1", "Team C2", "Team C3", "Team C4"] },
        { groupName: "Group D", teams: ["Team D1", "Team D2", "Team D3", "Team D4"] },
        { groupName: "Group E", teams: ["Team E1", "Team E2", "Team E3", "Team E4"] },
        { groupName: "Group F", teams: ["Team F1", "Team F2", "Team F3", "Team F4"] },
        { groupName: "Group G", teams: ["Team G1", "Team G2", "Team G3", "Team G4"] },
        { groupName: "Group H", teams: ["Team H1", "Team H2", "Team H3", "Team H4"] },
    ];

    const rounds = {
        roundOf16: [
            { team1: "Team A1", team2: "Team B2" },
            { team1: "Team C1", team2: "Team D2" },
            { team1: "Team E1", team2: "Team F2" },
            { team1: "Team G1", team2: "Team H2" },
        ],
        quarterfinals: [
            { team1: "Winner 1", team2: "Winner 2" },
            { team1: "Winner 3", team2: "Winner 4" },
        ],
        semifinals: [
            { team1: "Winner Q1", team2: "Winner Q2" },
        ],
        finals: [
            { team1: "Winner S1", team2: "Winner S2" },
        ],
        winner: "Champion",
    };

    const [showBracket, setShowBracket] = useState(false);
    const [groupResults, setGroupResults] = useState<any>(null);

    const handleSimulateBracket = () => {
        // Mock results for group winners and runners-up
        const groupResultsMock = {
            GroupA: { winner: "Team A1", runnerUp: "Team A2" },
            GroupB: { winner: "Team B1", runnerUp: "Team B2" },
            GroupC: { winner: "Team C1", runnerUp: "Team C2" },
            GroupD: { winner: "Team D1", runnerUp: "Team D2" },
            GroupE: { winner: "Team E1", runnerUp: "Team E2" },
            GroupF: { winner: "Team F1", runnerUp: "Team F2" },
            GroupG: { winner: "Team G1", runnerUp: "Team G2" },
            GroupH: { winner: "Team H1", runnerUp: "Team H2" },
        };
        setGroupResults(groupResultsMock);
        setShowBracket(true);
    };

    return (
        <div className={styles.pageBackground}>
            <h1 className={styles.title}>Predictor Page</h1>
            
            {/* Initial Group Stage Section */}
            <div className={styles.groupsSection}>
                <h2 className={styles.subtitle}>Group Stage</h2>
                <div className={styles.groups}>
                    {groups.map((group, index) => (
                        <div key={index} className={styles.groupCard}>
                            <h3>{group.groupName}</h3>
                            <ul>
                                {group.teams.map((team, idx) => (
                                    <li key={idx}>{team}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results Group Section */}
            {groupResults && (
                <div className={styles.resultsGroupsSection}>
                    <h2 className={styles.subtitle}>Group Stage Results</h2>
                    <div className={styles.groups}>
                        {Object.entries(groupResults).map(([groupName, result], index) => (
                            <div key={index} className={styles.groupCard}>
                                <h3>{groupName}</h3>
                                <ul>
                                    <li>Winner: {result.winner}</li>
                                    <li>Runner-Up: {result.runnerUp}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button className={styles.simulateButton} onClick={handleSimulateBracket}>
                Simulate Bracket
            </button>

            {/* Knockout Stage Section */}
            {showBracket && (
                <div className={styles.bracketSection}>
                    <h2 className={styles.subtitle}>Knockout Stage</h2>
                    <div className={styles.bracket}>
                        <div className={styles.round}>
                            <h3>Round of 16</h3>
                            {rounds.roundOf16.map((match, idx) => (
                                <div key={idx} className={styles.match}>
                                    <p>{match.team1} vs {match.team2}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Quarterfinals</h3>
                            {rounds.quarterfinals.map((match, idx) => (
                                <div key={idx} className={styles.match}>
                                    <p>{match.team1} vs {match.team2}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Semifinals</h3>
                            {rounds.semifinals.map((match, idx) => (
                                <div key={idx} className={styles.match}>
                                    <p>{match.team1} vs {match.team2}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Finals</h3>
                            {rounds.finals.map((match, idx) => (
                                <div key={idx} className={styles.match}>
                                    <p>{match.team1} vs {match.team2}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Winner</h3>
                            <p className={styles.winner}>{rounds.winner}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
