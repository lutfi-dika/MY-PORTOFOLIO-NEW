import React, { useState, useEffect } from 'react';
import '../styles/GithubProgress.css';

const GithubProgress = () => {
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const username = "lutfi-dika";

    useEffect(() => {
        // Fetch Data Profil
        fetch(`https://api.github.com/users/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.message !== "Not Found") setProfile(data);
            })
            .catch(err => console.error("Error profile:", err));

        // UBAH per_page=12 agar muncul banyak
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setRepos(data);
            })
            .catch(err => console.error("Error repos:", err));
    }, [username]);

    if (!profile) return <div style={{ color: 'white', padding: '20px' }}>Loading GitHub Data...</div>;

    return (
        <div className="progress-container">
            <div className="section-header">
                <span className="prefix">04.</span>
                <h2>Github Progress</h2>
                <div className="line"></div>
            </div>

            <div className="progress-bento">
                {/* Stats & Graph baris atas */}
                <div className="bento-top-row">
                    <div className="bento-item profile-stats">
                        <div className="stat-main">
                            <img src={profile.avatar_url} alt="profile" className="gh-avatar" />
                            <div>
                                <h3>{profile.name || username}</h3>
                                <p>@{username}</p>
                            </div>
                        </div>
                        <div className="stat-grid">
                            <div className="s-box">
                                <span className="s-val">{profile.public_repos}</span>
                                <span className="s-lbl">Repos</span>
                            </div>
                            <div className="s-box">
                                <span className="s-val">{profile.followers}</span>
                                <span className="s-lbl">Followers</span>
                            </div>
                        </div>
                        <a href={profile.html_url} target="_blank" rel="noreferrer" className="gh-link">
                            Follow on GitHub ↗
                        </a>
                    </div>

                    <div className="bento-item graph-card">
                        <span className="card-tag">ACTIVITY</span>
                        <h3>Contribution Graph</h3>
                        <img
                            src={`https://ghchart.rshah.org/5eb562/${username}`}
                            alt="Github Chart"
                            className="contribution-chart"
                        />
                    </div>
                </div>

                {/* List Repo Banyak (Grid) */}
                <div className="bento-item repos-full-list">
                    <span className="card-tag">ALL REPOSITORIES</span>
                    <div className="repo-grid">
                        {repos.length > 0 ? repos.map(repo => (
                            <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="repo-card-detailed">
                                <div className="repo-card-header">
                                    <span className="folder-icon">📁</span>
                                    <span className="repo-star">⭐ {repo.stargazers_count}</span>
                                </div>
                                <h4 className="repo-title">{repo.name}</h4>
                                <p className="repo-description">
                                    {repo.description || "No description provided."}
                                </p>
                                <div className="repo-card-footer">
                                    <span className="repo-language">
                                        <span className="dot"></span> {repo.language || 'Code'}
                                    </span>
                                </div>
                            </a>
                        )) : <p>No repositories found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GithubProgress;