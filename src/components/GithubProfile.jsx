import React, { useState, useEffect } from 'react';
import "../styles/GithubProfile.css";

const GithubProfile = () => {
    const [profile, setProfile] = useState(null);
    const [readmeHtml, setReadmeHtml] = useState(''); // Kita simpan dalam bentuk HTML
    const [loading, setLoading] = useState(true);

    const username = 'lutfi-dika';

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                // 1. Ambil data profil (Bio, Avatar, dll)
                const userRes = await fetch(`https://api.github.com/users/${username}`);
                const userData = await userRes.json();
                setProfile(userData);

                // 2. Ambil isi README mentah
                const readmeRes = await fetch(
                    `https://api.github.com/repos/${username}/${username}/readme`,
                    { headers: { 'Accept': 'application/vnd.github.v3.raw' } }
                );

                if (readmeRes.ok) {
                    const rawMarkdown = await readmeRes.text();

                    // 3. KONVERSI Markdown ke HTML (Tanpa Library)
                    // Kita kirim teks mentah ke API GitHub untuk diubah jadi HTML
                    const htmlRes = await fetch('https://api.github.com/markdown', {
                        method: 'POST',
                        body: JSON.stringify({ text: rawMarkdown })
                    });
                    const htmlText = await htmlRes.text();
                    setReadmeHtml(htmlText);
                }
            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGithubData();
    }, []);

    if (loading) return <div className="loading">MENGAMBIL DATA...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* Header Profil */}
                <div className="profile-header">
                    <img
                        src={profile?.avatar_url}
                        alt="Avatar"
                        className="avatar"
                    />
                    <div className="info">
                        <h1>{profile?.name || username}</h1>
                        <p className="bio">{profile?.bio || 'Fullstack Developer'}</p>
                        <p className="location">📍 {profile?.location || 'Indonesia'}</p>
                    </div>
                </div>

                {/* Konten About Me */}
                <div className="about-section">
                    <h2><span>👤</span> About Me</h2>

                    {/* Menggunakan dangerouslySetInnerHTML untuk merender HTML dari GitHub */}
                    <div
                        className="readme-content"
                        dangerouslySetInnerHTML={{ __html: readmeHtml }}
                    />
                </div>
            </div>
        </div>
    );
};

export default GithubProfile;