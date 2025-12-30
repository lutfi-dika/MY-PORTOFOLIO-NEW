import React, { useState, useEffect } from "react";
import { db } from "../App";
import { ref, onValue, runTransaction, set } from "firebase/database";
import "../styles/Polls.css";

const Polls = () => {
    const [pollData, setPollData] = useState(null);
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(true);

    // ID Unik untuk Polling ini
    const POLL_ID = "framework_poll_2025";

    useEffect(() => {
        // 1. Cek localStorage
        const hasVoted = localStorage.getItem(`voted_${POLL_ID}`);
        if (hasVoted) setVoted(true);

        // 2. Referensi Firebase
        const pollRef = ref(db, `polls/${POLL_ID}`);

        const unsubscribe = onValue(pollRef, (snapshot) => {
            const data = snapshot.val();

            // Di dalam file Polls.jsx, cari bagian set(pollRef, ...)

            if (!data) {
                const initialData = {
                    question: "Apa teknologi favoritmu untuk 2025? 🚀",
                    options: {
                        "React JS": 0,
                        "Next JS": 0,    // <--- Ganti "Next.js" menjadi "Next JS"
                        "Tailwind": 0,
                        "Firebase": 0
                    }
                };
                set(pollRef, initialData);
                setPollData(initialData);
            }
            else {
                setPollData(data);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleVote = (option) => {
        if (voted) return;

        const optionRef = ref(db, `polls/${POLL_ID}/options/${option}`);

        // Gunakan Transaction agar hitungan suara akurat
        runTransaction(optionRef, (currentValue) => {
            return (currentValue || 0) + 1;
        }).then(() => {
            setVoted(true);
            localStorage.setItem(`voted_${POLL_ID}`, "true");
        }).catch((err) => {
            console.error("Vote failed:", err);
        });
    };

    if (loading) return <div className="poll-loading">Memuat Polling... 🗳️</div>;
    if (!pollData || !pollData.options) return null;

    const totalVotes = Object.values(pollData.options).reduce((a, b) => a + b, 0);

    return (
        <div className="poll-container">
            <div className="poll-header">
                <span className="poll-icon">🗳️</span>
                <h3>{pollData.question}</h3>
            </div>

            <div className="poll-options">
                {Object.entries(pollData.options).map(([key, value]) => {
                    const percentage = totalVotes > 0 ? Math.round((value / totalVotes) * 100) : 0;

                    return (
                        <button
                            key={key}
                            onClick={() => handleVote(key)}
                            className={`poll-btn ${voted ? "voted" : ""}`}
                            disabled={voted}
                        >
                            {/* Baris Progress Background */}
                            <div
                                className="poll-progress-bar"
                                style={{ width: voted ? `${percentage}%` : "0%" }}
                            ></div>

                            <div className="poll-content">
                                <span className="poll-label">
                                    {key} {voted && <span className="vote-count">({value} suara)</span>}
                                </span>
                                {voted && <span className="poll-percent">{percentage}%</span>}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="poll-footer">
                <p>{totalVotes} orang telah berpartisipasi</p>
                {voted && <span className="thanks-msg">Terima kasih! ✨</span>}
            </div>
        </div>
    );
};

export default Polls;