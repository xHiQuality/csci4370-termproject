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
        roundOf16: ["Team A1", "Team B2", "Team C1", "Team D2", "Team E1", "Team F2", "Team G1", "Team H2"],
        quarterfinals: ["Winner 1", "Winner 2", "Winner 3", "Winner 4"],
        semifinals: ["Winner Q1", "Winner Q2"],
        finals: ["Winner S1", "Winner S2"],
        winner: "Champion",
    };

    const [showBracket, setShowBracket] = useState(false);

    const handleSimulateBracket = () => {
        setShowBracket(true);
    };

    return (
        <div className={styles.pageBackground}>
        <h1 className={styles.title}>Predictor Page</h1>
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
        <button className={styles.simulateButton} onClick={handleSimulateBracket}>
            Simulate Bracket
        </button>
        {showBracket && (
            <div className={styles.bracketSection}>
            <h2 className={styles.subtitle}>Knockout Stage</h2>
            <div className={styles.bracket}>
                <div className={styles.round}>
                <h3>Round of 16</h3>
                <ul>
                    {rounds.roundOf16.map((team, idx) => (
                    <li key={idx}>{team}</li>
                    ))}
                </ul>
                </div>
                <div className={styles.round}>
                <h3>Quarterfinals</h3>
                <ul>
                    {rounds.quarterfinals.map((team, idx) => (
                    <li key={idx}>{team}</li>
                    ))}
                </ul>
                </div>
                <div className={styles.round}>
                <h3>Semifinals</h3>
                <ul>
                    {rounds.semifinals.map((team, idx) => (
                    <li key={idx}>{team}</li>
                    ))}
                </ul>
                </div>
                <div className={styles.round}>
                <h3>Finals</h3>
                <ul>
                    {rounds.finals.map((team, idx) => (
                    <li key={idx}>{team}</li>
                    ))}
                </ul>
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
