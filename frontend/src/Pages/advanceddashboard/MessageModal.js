import React from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";

const MessageModal = ({
  isOpen,
  onClose,
  onSend,
  sendToAll,
  setSendToAll,
  phoneNumber,
  setPhoneNumber,
  message,
  setMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>📩 שליחת הודעה</h3>
        <label>
          <input
            type="checkbox"
            checked={sendToAll}
            onChange={() => setSendToAll(!sendToAll)}
          />
          שלח לכל הלקוחות
        </label>
        {!sendToAll && (
          <input
            type="text"
            placeholder="מספר טלפון"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        )}
        <textarea
          placeholder="הקלד את ההודעה כאן..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button className={styles.sendBtn} onClick={onSend}>
            📤 שלח
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            ❌ סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
