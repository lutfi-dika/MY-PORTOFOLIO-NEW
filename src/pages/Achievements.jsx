import React, { useState } from 'react';
import '../styles/Achievements.css';
import SertifCyber from '../assets/sertif(1).jpeg';
import SertifIdn from '../assets/sertif(2).jpeg';
import SertifPNJ from '../assets/sertif(3).jpeg';
import LikeButton from '../components/LikeButton';
import ImageModal from '../components/ImageModal'; 
// Import db dari App.js yang sudah menggunakan konfigurasi baru
import { db } from '../App'; 
import { ref, runTransaction, serverTimestamp, set } from "firebase/database";

const Achievements = () => {
    const [selectedImg, setSelectedImg] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const data = [
        {
            id: 1,
            title: "Participant Certificate",
            provider: "Clash of Cyber Heist",
            image: SertifCyber,
            badge: "Clash of Cyber Heist",
            color: "#4285F4"
        },
        {
            id: 2,
            title: "Participant Certificate",
            provider: "IDN Boarding School",
            image: SertifIdn,
            badge: "IDN Boarding School",
            color: "#5eb562"
        },
        {
            id: 3,
            title: "3rd Place Front Developer Finalist",
            provider: "ITECHNO CUP 2025",
            image: SertifPNJ,
            badge: "ITECHNO CUP 2025",
            color: "#ffcc00"
        }
    ];

    // Fungsi untuk membuka modal & kirim log ke Firebase
    const handleViewSertifikat = (item) => {
        setSelectedImg(item.image);
        setIsModalOpen(true);

        // --- OPTIMASI LOG AKTIVITAS ---
        // Kita buat ID unik berdasarkan provider
        const logId = item.provider.toLowerCase().replace(/\s+/g, '_');
        const viewRef = ref(db, `activity_logs/${logId}`);

        // Update jumlah klik/view menggunakan transaction
        runTransaction(viewRef, (currentData) => {
            if (currentData === null) {
                return {
                    count: 1,
                    lastViewed: serverTimestamp(),
                    name: item.provider
                };
            }
            return {
                ...currentData,
                count: (currentData.count || 0) + 1,
                lastViewed: serverTimestamp()
            };
        });
    };

    return (
        <div className="achieve-container">
            {/* Modal Popup */}
            <ImageModal
                isOpen={isModalOpen}
                imageSrc={selectedImg}
                onClose={() => setIsModalOpen(false)}
            />

            <header className="achieve-header">
                <h2 className="section-title">Achievements <span className="title-dot">.</span></h2>
                <p>Penghargaan dan sertifikasi yang memvalidasi keahlian teknis saya.</p>
            </header>

            <div className="achieve-grid">
                {data.map((item) => {
                    // ID unik untuk LikeButton agar tersimpan di node cert_...
                    const firestoreId = `cert_${item.provider.toLowerCase().replace(/\s+/g, '_')}`;

                    return (
                        <div key={item.id} className="achieve-card" style={{ '--accent': item.color }}>
                            <div className="image-wrapper" onClick={() => handleViewSertifikat(item)}>
                                <img src={item.image} alt={item.title} />
                                <div className="badge-overlay">Click to view</div>
                            </div>

                            <div className="card-info">
                                <div className="info-top">
                                    <span className="provider-name">{item.provider}</span>
                                    {/* LikeButton akan otomatis menggunakan DB dari App.js */}
                                    <LikeButton projectId={firestoreId} />
                                </div>

                                <h3>{item.title}</h3>

                                <div className="card-footer">
                                    <button
                                        className="btn-detail"
                                        onClick={() => handleViewSertifikat(item)}
                                    >
                                        Lihat Sertifikat
                                    </button>
                                    <span className="arrow">↗</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;