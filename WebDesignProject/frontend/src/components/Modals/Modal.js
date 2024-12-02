import React from 'react';
import './Modal.css';

const Modal = ({ onClose, children }) => {
    const handleOverlayClick = (event) => {
        if (event.target.className === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
