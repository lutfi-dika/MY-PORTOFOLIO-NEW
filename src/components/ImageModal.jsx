import React from 'react';
import '../styles/ImageModal.css';

const ImageModal = ({ isOpen, imageSrc, onClose }) => {
    // Jika modal tidak terbuka, jangan tampilkan apa-apa
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <img src={imageSrc} alt="Sertifikat Full" className="full-image" />
            </div>
        </div>
    );
};

export default ImageModal;