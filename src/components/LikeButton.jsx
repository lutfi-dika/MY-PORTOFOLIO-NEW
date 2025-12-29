import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, runTransaction, increment } from "firebase/database";
import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC4X_F67ci5dG2KAw5VpV2yXwXAJHwnKbU",
    authDomain: "visitor-counter-web.firebaseapp.com",
    databaseURL: "https://visitor-counter-web-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "visitor-counter-web",
    storageBucket: "visitor-counter-web.firebasestorage.app",
    messagingSenderId: "864397864528",
    appId: "1:864397864528:web:447116cf62d00bfb8beb55",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

const LikeButton = ({ projectId }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const likeRef = ref(db, `project_likes/${projectId}`);

        // Cek status like dari localStorage
        const savedLike = localStorage.getItem(`liked_${projectId}`);
        if (savedLike === 'true') setIsLiked(true);

        const unsubscribe = onValue(likeRef, (snapshot) => {
            setLikes(snapshot.val() || 0);
        });

        return () => unsubscribe();
    }, [projectId]);

    const handleToggleLike = () => {
        const likeRef = ref(db, `project_likes/${projectId}`);

        if (!isLiked) {
            // LOGIKA LIKE (+1)
            runTransaction(likeRef, (currentCount) => (currentCount || 0) + 1);
            setIsLiked(true);
            localStorage.setItem(`liked_${projectId}`, 'true');
        } else {
            // LOGIKA UNLIKE (-1)
            runTransaction(likeRef, (currentCount) => {
                if (currentCount && currentCount > 0) return currentCount - 1;
                return 0;
            });
            setIsLiked(false);
            localStorage.removeItem(`liked_${projectId}`); // Hapus jejak di browser
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            className={`like-button ${isLiked ? 'active' : ''}`}
            title={isLiked ? "Unlike" : "Like"}
        >
            <span className="heart-icon">{isLiked ? '❤️' : '🤍'}</span>
            <span className="like-count">{likes}</span>
        </button>
    );
};

export default LikeButton;