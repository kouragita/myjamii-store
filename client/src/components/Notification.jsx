// Notification.js
import React from 'react';

const Notification = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={styles.notification} onClick={onClose}>
            {message}
        </div>
    );
};

const styles = {
    notification: {
        position: 'fixed',
        top: '100px', // Change from bottom to top and set to 100px
        right: '20px',
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'opacity 0.5s ease',
        opacity: 0.9,
    },
};

export default Notification;
