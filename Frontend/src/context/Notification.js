import React from "react";

const Notification = ({ message, timeLeft, onClose }) => {
  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', padding: '15px', background: '#ffffff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
      <p style={{ margin: '0' }}>{message}. Time left: <span style={{ fontWeight: 'bold' }}>{timeLeft}</span></p>
      <button style={{ marginTop: '10px', padding: '8px 12px', cursor: 'pointer', background: '#007BFF', color: '#ffffff', border: 'none', borderRadius: '3px' }} onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;
