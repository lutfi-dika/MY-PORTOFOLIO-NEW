import React, { useState, useEffect } from "react";
import { db } from "../App"; // Pastikan path ini benar menunjuk ke file App lo yang ada 'export { db }'
import { ref, onValue } from "firebase/database";
import "../styles/HireMe.css";

const HireMe = () => {
    // State awal
    const [status, setStatus] = useState({ percent: 0, message: "Initializing..." });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Referensi ke path 'hire_info' di Database Singapore
        const hireRef = ref(db, "hire_info");

        console.log("📡 Attempting to sync Work Availability...");

        // 2. Listener Real-time
        const unsubscribe = onValue(hireRef, (snapshot) => {
            const data = snapshot.val();
            
            if (data) {
                console.log("✅ Data Received from Firebase:", data);
                setStatus({
                    // Gunakan Number() untuk konversi, default ke 0 jika gagal
                    percent: typeof data.status === 'number' ? data.status : Number(data.status) || 0,
                    message: data.message || "No status message set"
                });
            } else {
                console.warn("⚠️ Node 'hire_info' not found in database. Please add it manually.");
                setStatus({ 
                    percent: 0, 
                    message: "Database hire_info kosong. Harap isi manual di Console Firebase." 
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("❌ Firebase Read Error:", error);
            setLoading(false);
        });

        // Cleanup listener saat komponen tidak digunakan
        return () => unsubscribe();
    }, []);

    // Helper untuk menentukan warna berdasarkan persentase
    const getBarColor = () => {
        const p = status.percent;
        if (p >= 80) return "#4ade80"; // Hijau (Available)
        if (p >= 40) return "#fbbf24"; // Kuning (Busy)
        return "#f87171"; // Merah (Full)
    };

    if (loading) return (
        <div className="hire-container loading-state">
            <div className="shimmer">Syncing Status...</div>
        </div>
    );

    return (
        <div className="hire-container">
            <div className="hire-header">
                <span className="hire-title">💼 Work Availability</span>
                <span className="hire-percent" style={{ color: getBarColor() }}>
                    {status.percent}%
                </span>
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
                <span 
                    className="hire-dot" 
                    style={{ 
                        backgroundColor: getBarColor(),
                        boxShadow: `0 0 8px ${getBarColor()}` 
                    }}
                ></span>
                <p className="hire-desc">{status.message}</p>
            </div>
        </div>
    );
};

export default HireMe;