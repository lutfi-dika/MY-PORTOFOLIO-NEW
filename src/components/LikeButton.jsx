import React, { useState, useEffect } from 'react';
import { ref, onValue, runTransaction } from "firebase/database";
// IMPORT db dari App.jsx (Pastikan path file-nya bener, misal '../App')
import { db } from "../App"; 

const LikeButton = ({ projectId }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        // Referensi ke path project_likes di database yang bener
        const likeRef = ref(db, `project_likes/${projectId}`);

        // Cek status like dari localStorage biar user gak like berkali-kali
        const savedLike = localStorage.getItem(`liked_${projectId}`);
        if (savedLike === 'true') setIsLiked(true);

        // Ambil data likes realtime
        const unsubscribe = onValue(likeRef, (snapshot) => {
            setLikes(snapshot.val() || 0);
        });

        return () => unsubscribe();
    }, [projectId]);

    const handleToggleLike = () => {
        if (!projectId) return;
        const likeRef = ref(db, `project_likes/${projectId}`);

        if (!isLiked) {
            // LOGIKA LIKE (+1)
            runTransaction(likeRef, (currentCount) => (currentCount || 0) + 1)
                .then(() => {
                    setIsLiked(true);
                    localStorage.setItem(`liked_${projectId}`, 'true');
                })
                .catch((err) => console.error("Like Error:", err));
        } else {
            // LOGIKA UNLIKE (-1)
            runTransaction(likeRef, (currentCount) => {
                if (currentCount && currentCount > 0) return currentCount - 1;
                return 0;
            })
                .then(() => {
                    setIsLiked(false);
                    localStorage.removeItem(`liked_${projectId}`);
                })
                .catch((err) => console.error("Unlike Error:", err));
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