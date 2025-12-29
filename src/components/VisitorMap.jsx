import React, { useEffect, useState } from 'react';
import { db } from '../App';
import { ref, onValue, limitToLast, query } from "firebase/database";

const VisitorMap = () => {
    const [visitor, setVisitor] = useState(null);

    useEffect(() => {
        // Mengambil 1 data terbaru yang masuk ke Firebase
        const q = query(ref(db, 'online_users_details'), limitToLast(1));
        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lastData = Object.values(data)[0];
                setVisitor(lastData);
            }
        });
        return () => unsubscribe();
    }, []);

    // Koordinat Default jika data belum terdeteksi
    const lat = visitor?.lat || -6.2088;
    const lng = visitor?.lng || 106.8456;
    const cityName = visitor?.city || "Mendeteksi Lokasi...";

    // URL Google Maps Embed dengan Pin (q=) yang presisi
    const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

    return (
        <div className="visitor-map-container">
            <div className="map-header">
                <div className="live-indicator">
                    <span className="ping"></span>
                    LIVE VISITOR
                </div>
                <p className="city-name">📍 {cityName}</p>
            </div>

            <div className="map-frame">
                <iframe
                    title="Live Map"
                    width="100%"
                    height="280"
                    src={mapUrl}
                    style={{ border: 0, borderRadius: '15px', filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>

            <style>{`
        .visitor-map-container {
          background: #111;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 15px;
          margin: 20px 0;
          color: white;
          font-family: 'Inter', sans-serif;
        }
        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .live-indicator {
          background: #ff4d4d;
          font-size: 10px;
          font-weight: bold;
          padding: 4px 10px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ping {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: blink 1s infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .city-name { font-size: 13px; font-weight: 600; color: #00ff88; margin: 0; }
        .map-frame { overflow: hidden; border-radius: 15px; border: 1px solid #222; }
      `}</style>
        </div>
    );
};

export default VisitorMap;