import React, { useState, useEffect } from 'react';
// TAMBAHKAN onValue DI SINI
import { ref, onChildChanged, onChildAdded, onValue } from "firebase/database";
import "../styles/Notification.css";
import { db } from '../App';

const Notification = () => {
    const [notif, setNotif] = useState(null);

    useEffect(() => {
        const likesRef = ref(db, 'project_likes');
        const chatRef = ref(db, 'chats');

        const showNotif = (message) => {
            setNotif(message);
            const timer = setTimeout(() => setNotif(null), 4000);
            return () => clearTimeout(timer);
        };

        // 1. Deteksi Like
        const unsubscribeLikes = onChildChanged(likesRef, (snapshot) => {
            const projectName = snapshot.key.replace(/_/g, ' ').toUpperCase();
            showNotif(`🔥 Seseorang menyukai ${projectName}!`);
        });

        // 2. Deteksi Chat Baru (Tanpa memunculkan chat lama saat baru buka web)
        let initialDataLoaded = false;

        // Tandai bahwa data awal sudah selesai ditarik
        onValue(chatRef, () => {
            initialDataLoaded = true;
        }, { onlyOnce: true });

        const unsubscribeChat = onChildAdded(chatRef, (snapshot) => {
            // Hanya munculkan notif jika data masuk SETELAH initialDataLoaded = true
            if (!initialDataLoaded) return;

            const data = snapshot.val();
            showNotif(`💬 Pesan: "${data.text.substring(0, 20)}..."`);
        });

        return () => {
            unsubscribeLikes();
            unsubscribeChat();
        };
    }, []);

    if (!notif) return null;

    return (
        <div className="notif-toast">
            <div className="notif-content">
                {notif}
            </div>
        </div>
    );
};

export default Notification;