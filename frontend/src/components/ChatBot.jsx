import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaComments, FaTimes } from "react-icons/fa";
import "./cssfiles/ChatBot.css";
import { FaRobot } from "react-icons/fa";


/**
 * 🎤 **ChatBot Component** - צ'אט חכם עם עיצוב מודרני ואינטראקטיבי.
 * - כפתור צ'אט צף 🟣
 * - תיבת שיחה עם אנימציות 🎥
 * - שליחת הודעות וקבלת תגובות מהבוט 🤖
 */
const ChatBot = () => {
  const [message, setMessage] = useState(""); // הודעת המשתמש
  const [chatHistory, setChatHistory] = useState([]); // היסטוריית שיחה
  const [isOpen, setIsOpen] = useState(false); // האם הצ'אט פתוח
  const chatBoxRef = useRef(null); // הפנייה לתיבת הצ'אט (לגלילה אוטומטית)

  /**
   * 📤 **sendMessage()** - שליחת הודעה לשרת וקבלת תשובה מהבוט.
   */
  const sendMessage = async () => {
    if (!message.trim()) return; // בדיקה שההודעה לא ריקה

    // הוספת הודעת המשתמש להיסטוריה
    const userMessage = { sender: "אתה", text: message };
    setChatHistory([...chatHistory, userMessage]);

    try {
      // שליחת בקשה ל-Backend וקבלת תשובה מהבוט
      const { data } = await axios.post("http://localhost:5001/chat", { message });

      // הוספת תשובת הבוט להיסטוריה
      const botResponse = { sender: "ChatGPT", text: data.response };
      setChatHistory([...chatHistory, userMessage, botResponse]);
    } catch (error) {
      console.error("❌ שגיאה בשליחת ההודעה:", error);
    }

    setMessage(""); // איפוס שדה ההקלדה
  };

  /**
   * 📜 **useEffect** - גלילה אוטומטית להודעה האחרונה.
   */
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div>
      {/* 🔘 כפתור לפתיחת הצ'אט */}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaComments />
      </button>

      {/* 💬 חלון הצ'אט */}
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>צ'אט שירות לקוחות</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* 📜 תיבת הצ'אט */}
          <div className="chat-box" ref={chatBoxRef}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={msg.sender === "אתה" ? "user-msg" : "bot-msg"}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>

          {/* 🔤 אזור ההקלדה ושליחת ההודעה */}
          <div className="input-container">
            <input
              type="text"
              placeholder="כתוב הודעה..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()} // שליחה עם Enter
            />
            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
