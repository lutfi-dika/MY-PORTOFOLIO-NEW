import React from 'react';
import '../styles/RunningText.css';

const RunningText = () => {
    const words = [
        "BUILDING MODERN DIGITAL EXPERIENCES",
        "RESPONSIVE & USER - FOCUSED DESIGN",
        "REACT DEVELOPER SPECIALIST",
        "CREATIVE WEB SOLUTIONS",
        "AVAILABLE FOR FREELANCE & PROJECTS",
        "BASED IN BEKASI, INDONESIA"

    ];

    return (
        <div className="marquee-container">
            <div className="marquee-content">
                {/* Render pertama */}
                {words.map((word, index) => (
                    <div key={index} className="marquee-item">
                        <span className="dot">•</span>
                        {word}
                    </div>
                ))}
                {/* Render kedua (untuk efek infinite tanpa putus) */}
                {words.map((word, index) => (
                    <div key={`dup-${index}`} className="marquee-item">
                        <span className="dot">•</span>
                        {word}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RunningText;