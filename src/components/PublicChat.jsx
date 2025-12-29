import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, query, limitToLast } from "firebase/database";
import '../styles/PublicChat.css';

// GUNAKAN CONFIG DARI GAMBAR YANG KAMU KIRIM
const firebaseConfig = {
    apiKey: "AIzaSyAbHp2Ty7cn5J8H4Y2pAShqrJS8yE-wdnk",
    authDomain: "portfolio-chat-42c66.firebaseapp.com",
    // PERBAIKAN DI SINI:
    databaseURL: "https://portfolio-chat-42c66-default-rtdb.asia-southeast1.firebasedatabase.app", 
    projectId: "portfolio-chat-42c66",
    storageBucket: "portfolio-chat-42c66.firebasestorage.app",
    messagingSenderId: "755025564214",
    appId: "1:755025564214:web:17fccad18cbbda5fffbe97",
    measurementId: "G-0GYSPF2X3X"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const PublicChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [myId] = useState(`User-${Math.floor(Math.random() * 999)}`);
    const chatEndRef = useRef(null);

    useEffect(() => {
        // Mendengarkan data di folder 'chats'
        const chatRef = query(ref(db, 'chats'), limitToLast(50));
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setMessages(msgArray);
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

        await push(ref(db, 'chats'), {
            sender: myId,
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>💬 Global Talk</h3>
                <div className="online-tag">Realtime</div>
            </div>
            <div className="chat-window">
                {messages.map((m) => (
                    <div key={m.id} className={`chat-bubble ${m.sender === myId ? 'sent' : 'received'}`}>
                        <span className="chat-author">{m.sender === myId ? 'You' : m.sender}</span>
                        <p>{m.text}</p>
                        <span className="chat-time">{m.time}</span>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <form className="chat-input-area" onSubmit={sendChat}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis pesan..." />
                <button type="submit" className="chat-send-btn">✈</button>
            </form>
        </div>
    );
};

export default PublicChat;