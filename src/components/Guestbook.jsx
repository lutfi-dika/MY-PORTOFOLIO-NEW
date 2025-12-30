import React, { useState, useEffect } from "react";
import { db } from "../App";
import { ref, push, query, limitToLast, onValue, remove } from "firebase/database";
import emailjs from "@emailjs/browser";
import "../styles/Guestbook.css";

const Guestbook = () => {
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    // --- KONFIGURASI ---
    const SERVICE_ID = "service_0o4fd7m";
    const TEMPLATE_ID = "template_wbzhqn9";
    const PUBLIC_KEY = "hecOnh11tTOhBULtV";

    // Kamu bisa ubah ini jadi "Andika" saja jika ingin lebih simpel
    const ADMIN_SECRET = "Andika#Admin";

    useEffect(() => {
        const guestbookRef = query(ref(db, "guestbook"), limitToLast(50));
        const unsubscribe = onValue(guestbookRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setMessages(msgList.reverse());
            } else {
                setMessages([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setLoading(true);
        try {
            let finalName = name;
            let role = "user";

            // PERBAIKAN LOGIKA: Cek apakah input nama sesuai dengan rahasia
            if (name.trim() === ADMIN_SECRET) {
                finalName = "Andika (Owner)";
                role = "admin";
            }

            await push(ref(db, "guestbook"), {
                name: finalName,
                message: message,
                role: role,
                replyToName: replyingTo ? replyingTo.name : null,
                createdAt: Date.now(),
            });

            const templateParams = {
                title: role === "admin" ? `Andika membalas @${replyingTo?.name || 'User'}` : "Pesan Baru",
                name: finalName,
                message: message,
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

            setMessage("");
            setName("");
            setReplyingTo(null);
            alert("Pesan berhasil terkirim! ✨");
        } catch (error) {
            alert("Gagal mengirim pesan.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus pesan ini?")) {
            await remove(ref(db, `guestbook/${id}`));
        }
    };

    return (
        <div className="gb-container">
            <h2 className="gb-title">Guestbook 📝✨</h2>
            <p className="gb-subtitle">Halo, saya <b>Andika</b>. Silakan tinggalkan pesan Anda!</p>

            <form onSubmit={handleSubmit} className="gb-form">
                {replyingTo && (
                    <div className="gb-reply-banner">
                        <span>Membalas <b>@{replyingTo.name}</b></span>
                        <button type="button" onClick={() => setReplyingTo(null)}>Batal ✕</button>
                    </div>
                )}

                <input
                    type="text"
                    className="gb-input"
                    placeholder="Nama Anda..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    className="gb-textarea"
                    placeholder={replyingTo ? `Balas @${replyingTo.name}...` : "Tulis pesan..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                ></textarea>
                <button type="submit" className="gb-button" disabled={loading}>
                    {loading ? "Mengirim..." : replyingTo ? "Kirim Balasan 💬" : "Kirim Pesan 🚀"}
                </button>
            </form>

            <div className="gb-list">
                {messages.map((msg) => (
                    /* Pastikan class admin-card terpasang jika role === "admin" */
                    <div key={msg.id} className={`gb-card ${msg.role === "admin" ? "admin-card" : ""}`}>
                        {msg.replyToName && (
                            <div className="gb-reply-label">
                                📩 Membalas <b>@{msg.replyToName}</b>
                            </div>
                        )}

                        <div className="gb-card-header">
                            <span className="gb-name">
                                {msg.name}
                                {msg.role === "admin" && <span className="admin-badge">Owner 👑</span>}
                            </span>
                            <span className="gb-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="gb-message">{msg.message}</p>

                        <div className="gb-card-actions">
                            <button
                                onClick={() => {
                                    setReplyingTo({ name: msg.name });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="gb-action-link"
                            >
                                Balas 💬
                            </button>
                            <button onClick={() => handleDelete(msg.id)} className="gb-action-link delete">
                                Hapus 🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Guestbook;