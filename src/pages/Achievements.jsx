import React from 'react';
import '../styles/Achievements.css';
import SertifCyber from '../assets/sertif(1).jpeg';
import SertifIdn from '../assets/sertif(2).jpeg';
import SertifPNJ from '../assets/sertif(3).jpeg';

const Achievements = () => {
    const data = [
        {
            id: 1,
            title: "participant certificate",
            provider: "Clash of Cyber Heist",
            image: [SertifCyber],
            badge: "Clash of Cyber Heist",
            color: "#4285F4"
        },
        {
            id: 2,
            title: "participant certificate",
            provider: "IDN Boarding School",
            image: [SertifIdn],
            badge: "IDN Boarding School",
            color: "#5eb562"
        },
        {
            id: 3,
            title: "3rd place front developer finalist certificate",
            provider: "ITECHNO CUP 2025",
            image: [SertifPNJ],
            badge: "ITECHNO CUP 2025",
            color: "#ffcc00"
        }
    ];

    return (
        <div className="achieve-container">
            <header className="achieve-header">
                <h2 className="section-title">Achievements <span className="title-dot">.</span></h2>
                <p>Penghargaan dan sertifikasi yang memvalidasi keahlian teknis saya.</p>
            </header>

            <div className="achieve-grid">
                {data.map((item) => (
                    <div key={item.id} className="achieve-card" style={{ '--accent': item.color }}>
                        <div className="image-wrapper">
                            <img src={item.image} alt={item.title} />
                            <div className="badge-overlay">{item.badge}</div>
                        </div>

                        <div className="card-info">
                            <span className="provider-name">{item.provider}</span>
                            <h3>{item.title}</h3>
                            <div className="card-footer">
                                <button className="btn-detail">Lihat Sertifikat</button>
                                <span className="arrow">↗</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;