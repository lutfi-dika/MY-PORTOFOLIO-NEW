import React, { useState, useEffect } from 'react'; // Sudah diperbaiki (tambah useState & useEffect)
import '../styles/AboutSection.css';

const AboutSection = () => {
    // Logic untuk Jam Digital
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <section className="about-container">
            <div className="section-header">
                <span className="prefix">01.</span>
                <h2>Behind the Code</h2>
                <div className="line"></div>
            </div>

            <div className="about-bento-grid">
                {/* Card 1: Main Story */}
                <div className="about-card story-card">
                    <h3>My Story</h3>
                    <p>
                        Saya adalah seorang pelajar yang memiliki ketertarikan dan komitmen tinggi dalam bidang
                        <span className="text-bright"> pengembangan web dan teknologi digital.</span> Sejak awal
                        mengenal dunia pemrograman, saya terus mengembangkan kemampuan teknis serta pemahaman
                        konseptual dalam membangun website yang fungsional, responsif, dan memiliki tampilan
                        profesional. Fokus utama saya berada pada Front-End Development, dengan teknologi seperti
                        <span className="text-bright"> HTML, CSS, JavaScript, dan React.</span>
                    </p>
                    <div className="card-tags">
                        <span>#ProblemSolver</span>
                        <span>#TechEnthusiast</span>
                        <span>#LifelongLearner</span>
                    </div>
                </div>

                {/* Card 2: Jam Digital */}
                <div className="about-card clock-card">
                    <div className="clock-wrapper">
                        <span className="clock-label">CURRENT TIME</span>
                        <div className="digital-time">{formatTime(time)}</div>
                        <div className="clock-footer">
                            <span className="clock-date">{formatDate(time)}</span>
                            <div className="live-indicator">
                                <span className="pulse-dot"></span>
                                LIVE
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Academic Journey */}
                <div className="about-card interest-card">
                    <h3>Academic Journey</h3>
                    <ul className="interest-list">
                        <li>Elementary School</li>
                        <li>Junior High School</li>
                        <li>Vocational High School</li>
                    </ul>
                </div>

                {/* Card 4: Quote */}
                <div className="about-card quote-card">
                    <div className="quote-icon">“</div>
                    <p>Simple is better than complex. Complex is better than complicated.</p>
                    <span className="quote-author">— Zen of Python</span>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;