import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import '../styles/PublicChat.css';

const PublicChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [userId] = useState(`user-${Math.floor(Math.random() * 1000)}`);
    const chatEndRef = useRef(null);
    const channelRef = useRef(null);

    // Auto scroll ke bawah setiap ada pesan baru
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // GANTI DENGAN APP_KEY DAN CLUSTER DARI PUSHER KAMU
        const pusher = new Pusher('32de7df0c6a9cc1825bf', {
            cluster: 'ap1',
            enabledTransports: ['ws', 'wss'],
            forceTLS: true
        });

        // Nama channel harus diawali 'private-' atau 'presence-' untuk client events
        // Tapi untuk simple public, kita pakai 'chat-channel'
        // Catatan: Client events butuh auth, untuk murni frontend tanpa backend, 
        // pastikan "Enable Client Events" sudah ON di dashboard Pusher.
        const channel = pusher.subscribe('private-chat');
        channelRef.current = channel;

        channel.bind('client-new-message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            pusher.unsubscribe('private-chat');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const payload = {
            text: input,
            senderId: userId,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Mengirim ke orang lain via Pusher
        if (channelRef.current) {
            channelRef.current.trigger('client-new-message', payload);
        }

        // Menampilkan di layar sendiri
        setMessages((prev) => [...prev, payload]);
        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Public Chat</h3>
                <div className="online-count">
                    <span className="pulse-dot"></span> Online
                </div>
            </div>

            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-bubble ${msg.senderId === userId ? 'sent' : 'received'}`}
                    >
                        <span className="chat-author">
                            {msg.senderId === userId ? 'You' : msg.senderId}
                        </span>
                        <p>{msg.text}</p>
                        <span className="chat-time">{msg.time}</span>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" className="chat-send-btn">
                    ✈
                </button>
            </form>
        </div>
    );
};

// BARIS INI YANG PENTING AGAR TIDAK ERROR SYNTAX!
export default PublicChat;