import React, { useState } from "react";

const ChatAPI = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch("https://garage-chatbot.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("שגיאה בשליחת ההודעה:", error);
      setResponse("❌ שגיאה בשליחה לשרת");
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "300px",
      padding: "12px",
      background: "#fff",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      borderRadius: "10px",
      zIndex: 1000,
      fontFamily: "Arial"
    }}>
      <h4>🤖 שאל את הבוט</h4>
      <input
        type="text"
        placeholder="מה ברצונך לשאול?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
      />
      <button onClick={sendMessage} style={{ width: "100%", padding: "8px" }}>
        שלח
      </button>
      {response && (
        <div style={{
          marginTop: "10px",
          background: "#f1f1f1",
          padding: "10px",
          borderRadius: "6px",
          whiteSpace: "pre-wrap"
        }}>
          {response}
        </div>
      )}
    </div>
  );
};

export default ChatAPI;
 