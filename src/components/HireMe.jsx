import React, { useState, useEffect } from "react";
import { db } from "../App";
import { ref, onValue } from "firebase/database";
import "../styles/HireMe.css";

const HireMe = () => {
    const [status, setStatus] = useState({ percent: 0, message: "Checking..." });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mengambil data dari folder 'hire_info' yang kamu buat di Firebase
        const hireRef = ref(db, "hire_info");

        const unsubscribe = onValue(hireRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStatus({
                    percent: Number(data.status) || 0,
                    message: data.message || "No Status"
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getBarColor = () => {
        const p = status.percent;
        if (p > 70) return "#4ade80"; // Hijau
        if (p > 30) return "#fbbf24"; // Kuning
        return "#f87171"; // Merah
    };

    if (loading) return <div className="hire-loading">Syncing...</div>;

    return (
        <div className="hire-container">
            <div className="hire-header">
                <span className="hire-title">💼 Work Availability</span>
                <span className="hire-percent">{status.percent}%</span>
            </div>

            <div className="hire-progress-bg">
                <div
                    className="hire-progress-fill"
                    style={{
                        width: `${status.percent}%`,
                        backgroundColor: getBarColor(),
                        boxShadow: `0 0 15px ${getBarColor()}66`
                    }}
                ></div>
            </div>

            <div className="hire-status-box">
                <span className="hire-dot" style={{ backgroundColor: getBarColor() }}></span>
                <p className="hire-desc">{status.message}</p>
            </div>

        </div>
    );
};

export default HireMe;