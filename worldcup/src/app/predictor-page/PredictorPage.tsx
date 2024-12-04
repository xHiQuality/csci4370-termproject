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
            { team1: { name: "Team A1", points: 10 }, team2: { name: "Team B2", points: 8 } },
            { team1: { name: "Team C1", points: 9 }, team2: { name: "Team D2", points: 7 } },
            { team1: { name: "Team E1", points: 11 }, team2: { name: "Team F2", points: 6 } },
            { team1: { name: "Team G1", points: 8 }, team2: { name: "Team H2", points: 7 } },
        ],
        quarterfinals: [
            { team1: { name: "Winner 1", points: 12 }, team2: { name: "Winner 2", points: 9 } },
            { team1: { name: "Winner 3", points: 10 }, team2: { name: "Winner 4", points: 8 } },
        ],
        semifinals: [
            { team1: { name: "Winner Q1", points: 13 }, team2: { name: "Winner Q2", points: 10 } },
        ],
        finals: [
            { team1: { name: "Winner S1", points: 15 }, team2: { name: "Winner S2", points: 12 } },
        ],
        winner: { name: "Champion", points: 20 },
    };

    const [showBracket, setShowBracket] = useState(false);
    const [groupResults, setGroupResults] = useState<any>(null);

    const handleSimulateBracket = () => {
        // Mock results for group winners and runners-up with points
        const groupResultsMock = {
            GroupA: { winner: { name: "Team A1", points: 9 }, runnerUp: { name: "Team A2", points: 6 } },
            GroupB: { winner: { name: "Team B1", points: 7 }, runnerUp: { name: "Team B2", points: 5 } },
            GroupC: { winner: { name: "Team C1", points: 8 }, runnerUp: { name: "Team C2", points: 4 } },
            GroupD: { winner: { name: "Team D1", points: 10 }, runnerUp: { name: "Team D2", points: 6 } },
            GroupE: { winner: { name: "Team E1", points: 9 }, runnerUp: { name: "Team E2", points: 6 } },
            GroupF: { winner: { name: "Team F1", points: 8 }, runnerUp: { name: "Team F2", points: 5 } },
            GroupG: { winner: { name: "Team G1", points: 7 }, runnerUp: { name: "Team G2", points: 5 } },
            GroupH: { winner: { name: "Team H1", points: 9 }, runnerUp: { name: "Team H2", points: 6 } },
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
                        {Object.entries(groupResults).map(([groupName, result]: any, index) => (
                            <div key={index} className={styles.groupCard}>
                                <h3>{groupName}</h3>
                                <ul>
                                    <li>Winner: {result.winner.name} ({result.winner.points} points)</li>
                                    <li>Runner-Up: {result.runnerUp.name} ({result.runnerUp.points} points)</li>
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
                                    <p>
                                        {match.team1.name} ({match.team1.points} points) vs {match.team2.name} ({match.team2.points} points)
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Quarterfinals</h3>
                            {rounds.quarterfinals.map((match, idx) => (
                                <div key={idx} className={styles.match}>
                                    <p>
                                        {match.team1.name} ({match.team1.points} points) vs {match.team2.name} ({match.team2.points} points)
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Semifinals</h3>
                            {rounds.semifinals.map((match, idx) => (
                                <div key={idx} className={styles.match}>
                                    <p>
                                        {match.team1.name} ({match.team1.points} points) vs {match.team2.name} ({match.team2.points} points)
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Finals</h3>
                            {rounds.finals.map((match, idx) => (
                                <div key={idx} className={styles.match}>
                                    <p>
                                        {match.team1.name} ({match.team1.points} points) vs {match.team2.name} ({match.team2.points} points)
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Winner</h3>
                            <p className={styles.winner}>
                                {rounds.winner.name} ({rounds.winner.points} points)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

