import React from 'react';
import '../styles/Sidebar.css';

// Tambahkan props activeTab dan setActiveTab
const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'Home', label: 'Home', icon: '🏠' },
        { id: 'About', label: 'About', icon: '👤' },
        { id: 'Achievements', label: 'Achievements', icon: '🏆' },
        { id: 'Progres', label: 'Progres', icon: '📈' },
        { id: 'Projects', label: 'Projects', icon: '📁' },
        { id: 'Chat', label: 'Chat', icon: '�' },
        { id: 'Contact', label: 'Contact', icon:'📱'},
        { id: 'Guestbook', label: 'Guestbook', icon:'📝'},
        { id: 'Polls', label: 'Polls', icon:'📊'},
        { id: 'HireMe', label: 'HireMe', icon:'💼'},
    ];

    return (
        <aside className="sidebar">
            <div className="profile-section">
                <div className="profile-img">
                    {/* Ganti dengan foto  */}
                    <img src="https://avatars.githubusercontent.com/u/201941138?v=4" alt="Lutfi" />
                </div>
                <div className="profile-text">
                    <h3>Lutfi Andika <span className="verified-badge">✓</span></h3>
                    <p className="username">@303.andika</p>
                </div>
            </div>

            <nav className="nav-menu">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        // Jika ID menu sama dengan state activeTab, tambahkan class active
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        // Saat diklik, panggil fungsi setActiveTab dari App.js
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                        {activeTab === item.id && <span className="active-indicator">→</span>}
                    </div>
                ))}
            </nav>

          
            <footer className="sidebar-footer">
                <p>COPYRIGHT © 2025</p>
                <p>Lutfi Andika. All rights reserved.</p>
            </footer>
        </aside>
    );
};

export default Sidebar;