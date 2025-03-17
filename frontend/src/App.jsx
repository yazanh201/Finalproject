import React from "react";
import ChatBot from "./components/ChatBot"; // חיבור הצ'אט
import "./App.css"; // אם אין לך App.css, תוכל להשתמש ב-index.css

function App() {
  return (
    <div className="App">
      <ChatBot />
    </div>
  );
}

export default App;
