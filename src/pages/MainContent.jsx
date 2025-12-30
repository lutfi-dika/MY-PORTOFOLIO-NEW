import React from 'react';
import RunningText from '../components/RunningText';
import VisitorMap from '../components/VisitorMap'
import Guestbook from '../components/Guestbook';
import '../styles/MainContent.css';

const MainContent = () => {
    const categories = [
        {
            title: "Frontend Mastery",
            skills: [

                { name: "Html", level: "Advanced", icon: "🔶", glow: "#f7921eff" },
                { name: "CSS", level: "Advanced", icon: "🎨", glow: "#2965f1ff" },
                { name: "JavaScript", level: "Advanced", icon: "🟨", glow: "#F7DF1E" },
                { name: "React", level: "Advanced", icon: "⚛️", glow: "#61DAFB" },
                { name: "TypeScript", level: "Advanced", icon: "🧠", color: "#3178C6" },

            ]
        },
        {

            title: "Frameworks & Libraries",
            skills: [
                { name: "Tailwind CSS", level: "Advanced", icon: "🌬️", glow: "#38B2AC" },
                { name: "Bootstrap", level: "Advanced", icon: "🅱️", glow: "#7952B3" },
                { name: "UIverse", level: "Intermediate", icon: "🎨", glow: "#6366F1" },
                { name: "AOS Animation", level: "Intermediate", icon: "✨", glow: "#22C55E" },
                { name: "Flowbite", level: "Intermediate", icon: "🧩", glow: "#0EA5E9" },
                { name: "GeeksHelp", level: "Intermediate", icon: "🧠", glow: "#10B981" }


            ]

        },
        {
            title: "Backend & Systems",
            skills: [
                { name: "PHP", level: "Advanced", icon: "🐘", glow: "#777BB4" },
                { name: "phpMyAdmin", level: "Intermediate", icon: "🛢️", glow: "#F39C12" },
                { name: "Laravel", level: "being studied", icon: "🚀", glow: "#FF2D20" }
            ]
        },

        {
            title: "Tools & Platforms",
            skills: [
                { name: "Github", level: "Advanced", icon: "💻", glow: "#24292F" },
                { name: "VS Code", level: "Advanced", icon: "📝", glow: "#007ACC" },
                { name: "Git", level: "Advanced", icon: "🔧", glow: "#F05032" },
            ]
        },
    ];

    return (
        <div className="main-container">
            {/* Glass Header Card */}
            <header className="glass-card hero-card">
                <div className="status-indicator">
                    <span className="dot"></span> Available for New Projects
                </div>
                <h1 className="gradient-text">Lutfi Andika</h1>
                <p className="hero-subtitle">
                    Crafting <span className="highlight">Digital Experiences</span> through clean code and intuitive design.
                </p>

                <div className="hero-meta">
                    <div className="meta-item">📍 Bekasi</div>
                    <div className="meta-item">🌐 Owner of Webkraf </div>
                </div>
            </header>

            <RunningText />

            {/* Skills Section with Better Grouping */}
            <section className="skills-section">
                <div className="section-title" style={{ color: "oklch(49.709% 0.0959 286.868)", fontsize: "0.9rem" }}>
                    <span className="prefix">//</span> Professional Stack
                </div>

                {categories.map((cat, idx) => (
                    <div key={idx} className="skill-category">
                        <h4>{cat.title}</h4>
                        <div className="new-grid">
                            {cat.skills.map((skill, i) => (
                                <div
                                    key={i}
                                    className="premium-skill-card"
                                    style={{ '--glow-color': skill.glow }}
                                >
                                    <div className="skill-icon">{skill.icon}</div>
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-level">{skill.level}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
            <VisitorMap />
            {/* <Guestbook /> */}
        </div>
    );
};

export default MainContent;