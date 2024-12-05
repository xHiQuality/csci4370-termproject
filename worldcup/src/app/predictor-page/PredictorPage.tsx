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

    const [showBracket, setShowBracket] = useState(false);
    const [groupResults, setGroupResults] = useState<any>(null);

    const knockoutStages = {
        roundOf16: [
            { team1: "Team A1", team2: "Team B2", score: "3-1" },
            { team1: "Team C1", team2: "Team D2", score: "1-2" },
            { team1: "Team E1", team2: "Team F2", score: "0-1" },
            { team1: "Team G1", team2: "Team H2", score: "2-0" },
            { team1: "Team B1", team2: "Team A2", score: "4-3" },
            { team1: "Team D1", team2: "Team C2", score: "1-0" },
            { team1: "Team F1", team2: "Team E2", score: "2-2" },
            { team1: "Team H1", team2: "Team G2", score: "1-3" },
        ],
        quarterfinals: [
            { team1: "Winner 1", team2: "Winner 2", score: "2-1" },
            { team1: "Winner 3", team2: "Winner 4", score: "3-2" },
            { team1: "Winner 5", team2: "Winner 6", score: "0-1" },
            { team1: "Winner 7", team2: "Winner 8", score: "1-3" },
        ],
        semifinals: [
            { team1: "Winner Q1", team2: "Winner Q2", score: "2-0" },
            { team1: "Winner Q3", team2: "Winner Q4", score: "1-1" },
        ],
        finals: [
            { team1: "Winner S1", team2: "Winner S2", score: "3-1" },
        ],
        winner: "Winner S1",
    };

    const handleSimulateBracket = () => {
        // Mock group stage results with points for all teams
        const groupResultsMock = {
            GroupA: [
                { team: "Team A1", points: 9 },
                { team: "Team A2", points: 6 },
                { team: "Team A3", points: 3 },
                { team: "Team A4", points: 1 },
            ],
            GroupB: [
                { team: "Team B1", points: 7 },
                { team: "Team B2", points: 5 },
                { team: "Team B3", points: 4 },
                { team: "Team B4", points: 2 },
            ],
            GroupC: [
                { team: "Team C1", points: 8 },
                { team: "Team C2", points: 6 },
                { team: "Team C3", points: 3 },
                { team: "Team C4", points: 1 },
            ],
            GroupD: [
                { team: "Team C1", points: 8 },
                { team: "Team C2", points: 6 },
                { team: "Team C3", points: 3 },
                { team: "Team C4", points: 1 },
            ],
            GroupE: [
                { team: "Team E1", points: 8 },
                { team: "Team E2", points: 6 },
                { team: "Team E3", points: 3 },
                { team: "Team E4", points: 1 },
            ],
            GroupF: [
                { team: "Team F1", points: 8 },
                { team: "Team F2", points: 6 },
                { team: "Team F3", points: 3 },
                { team: "Team F4", points: 1 },
            ],
            GroupG: [
                { team: "Team G1", points: 8 },
                { team: "Team G2", points: 6 },
                { team: "Team G3", points: 3 },
                { team: "Team G4", points: 1 },
            ],
            GroupH: [
                { team: "Team H1", points: 8 },
                { team: "Team H2", points: 6 },
                { team: "Team H3", points: 3 },
                { team: "Team H4", points: 1 },
            ],
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
                        {Object.entries(groupResults).map(([groupName, results]: any, index) => (
                            <div key={index} className={styles.groupCard}>
                                <h3>{groupName}</h3>
                                <ul>
                                    {results.map((result: any, idx: number) => (
                                        <li key={idx}>
                                            {result.team} - {result.points} points
                                        </li>
                                    ))}
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
                            {knockoutStages.roundOf16.map((match, idx) => (
                                <p key={idx}>
                                    {match.team1} {match.score} {match.team2}
                                </p>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Quarterfinals</h3>
                            {knockoutStages.quarterfinals.map((match, idx) => (
                                <p key={idx}>
                                    {match.team1} {match.score} {match.team2}
                                </p>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Semifinals</h3>
                            {knockoutStages.semifinals.map((match, idx) => (
                                <p key={idx}>
                                    {match.team1} {match.score} {match.team2}
                                </p>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Finals</h3>
                            {knockoutStages.finals.map((match, idx) => (
                                <p key={idx}>
                                    {match.team1} {match.score} {match.team2}
                                </p>
                            ))}
                        </div>
                        <div className={styles.round}>
                            <h3>Winner</h3>
                            <p className={styles.winner}>{knockoutStages.winner}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
