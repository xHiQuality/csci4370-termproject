"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./PredictorPage.module.css";

export default function PredictorPage() {
    const [showBracket, setShowBracket] = useState(false);
    const [groupResults, setGroupResults] = useState<any>(null);
    const [knockoutStages, setKnockoutStages] = useState<any>(null);

    // Fetch group predictions and knockout stage data
    useEffect(() => {
        const fetchGroupPredictions = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/predictor/all-group-predictions"
                );
                setGroupResults(response.data.groupResults);
                setKnockoutStages({
                    roundOf16: response.data.roundOf16Results || [],
                    quarterfinals: response.data.quarterFinalMatchups.map((match: any, idx: number) => ({
                        home: match.home,
                        away: match.away,
                        winner: response.data.quarterFinalResults[idx]?.winner,
                    })) || [],
                    semifinals: response.data.semiFinalMatchups.map((match: any, idx: number) => ({
                        home: match.home,
                        away: match.away,
                        winner: response.data.semiFinalResults[idx]?.winner,
                    })) || [],
                    finals: response.data.finalMatchups.map((match: any, idx: number) => ({
                        home: match.home,
                        away: match.away,
                        winner: response.data.finalResults[idx]?.winner,
                    })) || [],
                    winner: response.data.champion[0] || "",
                });
            } catch (error) {
                console.error("Error fetching group predictions:", error);
            }
        };

        fetchGroupPredictions();
    }, []);

    return (
        <div className={styles.pageBackground}>
            <h1 className={styles.title}>Predictor Page</h1>

            {/* Initial Group Stage Section */}
            <div className={styles.groupsSection}>
                <h2 className={styles.subtitle}>Group Stage</h2>
                <div className={styles.groups}>
                    {groupResults &&
                        Object.entries(groupResults).map(([groupName, results]: any, index) => (
                            <div key={index} className={styles.groupCard}>
                                <h3>{groupName}</h3>
                                <ul>
                                    {results.teamPoints.map((team: any, idx: number) => (
                                        <li key={idx}>
                                            {team.team}
                                        </li>
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
                                    {results.teamPoints.map((team: any, idx: number) => (
                                        <li key={idx}>
                                            {team.team} - {team.points} points
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Knockout Stage Button */}
            <button
                className={styles.simulateButton}
                onClick={() => setShowBracket(true)}
                disabled={!groupResults}
            >
                Simulate Bracket
            </button>

            {/* Knockout Stage Section */}
            {showBracket && knockoutStages && (
                <div className={styles.bracketSection}>
                    <h2 className={styles.subtitle}>Knockout Stage</h2>
                    <div className={styles.bracket}>
                        {/* Round of 16 */}
                        <div className={styles.round}>
                            <h3>Round of 16</h3>
                            {knockoutStages.roundOf16.map((match: any, idx: number) => (
                                <p key={idx}>
                                    {match.matchup.replace(
                                        /(\d[A-H])/g,
                                        (seed: string) =>
                                            groupResults[seed[1]].teamPoints.find(
                                                (team: any) => team.seed === seed
                                            )?.team || seed
                                    )}{" "}
                                    - Winner: {match.winner}
                                </p>
                            ))}
                        </div>

                        {/* Quarterfinals */}
                        <div className={styles.round}>
                            <h3>Quarterfinals</h3>
                            {knockoutStages.quarterfinals.map((match: any, idx: number) => (
                                <p key={idx}>
                                    {match.home} vs {match.away} - Winner: {match.winner}
                                </p>
                            ))}
                        </div>

                        {/* Semifinals */}
                        <div className={styles.round}>
                            <h3>Semifinals</h3>
                            {knockoutStages.semifinals.map((match: any, idx: number) => (
                                <p key={idx}>
                                    {match.home} vs {match.away} - Winner: {match.winner}
                                </p>
                            ))}
                        </div>

                        {/* Finals */}
                        <div className={styles.round}>
                            <h3>Finals</h3>
                            {knockoutStages.finals.map((match: any, idx: number) => (
                                <p key={idx}>
                                    {match.home} vs {match.away} - Winner: {match.winner}
                                </p>
                            ))}
                        </div>

                        {/* Champion */}
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
