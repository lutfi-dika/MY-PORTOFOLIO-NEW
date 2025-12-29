import React, { useState, useEffect, useRef } from 'react';
// Import 'db' dari App.js agar tidak error "duplicate-app"
import { db } from '../App';
import { ref, push, onValue, query, limitToLast } from "firebase/database";
import '../styles/PublicChat.css';

const PublicChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    // Menggunakan localStorage agar ID user tetap sama saat refresh
    const [myId] = useState(() => {
        const savedId = localStorage.getItem('chat_user_id');
        if (savedId) return savedId;
        const newId = `User-${Math.floor(Math.random() * 999)}`;
        localStorage.setItem('chat_user_id', newId);
        return newId;
    });

    const chatEndRef = useRef(null);

    useEffect(() => {
        // Mendengarkan data di folder 'chats' pada database yang sama dengan App.js
        const chatRef = query(ref(db, 'chats'), limitToLast(50));

        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setMessages(msgArray);
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendChat = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            await push(ref(db, 'chats'), {
                sender: myId,
                text: input,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now() // Tambahkan timestamp untuk pengurutan
            });
            setInput('');
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>💬 Global Talk</h3>
                <div className="online-tag">Live Chat</div>
            </div>
            <div className="chat-window">
                {messages.length === 0 ? (
                    <p className="no-chat">Belum ada pesan. Mulai obrolan!</p>
                ) : (
                    messages.map((m) => (
                        <div key={m.id} className={`chat-bubble ${m.sender === myId ? 'sent' : 'received'}`}>
                            <span className="chat-author">{m.sender === myId ? 'You' : m.sender}</span>
                            <p>{m.text}</p>
                            <span className="chat-time">{m.time}</span>
                        </div>
                    ))
                )}
                <div ref={chatEndRef} />
            </div>
            <form className="chat-input-area" onSubmit={sendChat}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tulis pesan..."
                />
                <button type="submit" className="chat-send-btn">✈</button>
            </form>
        </div>
    );
};

export default PublicChat;