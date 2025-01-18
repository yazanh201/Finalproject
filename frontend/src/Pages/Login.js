import React, { useState } from "react"; // ייבוא React וה-hook useState לניהול state מקומי
import { useNavigate } from "react-router-dom"; // ייבוא useNavigate לניווט בין דפים

const Login = () => {
  // state עבור שם המשתמש והסיסמה
  const [username, setUsername] = useState(""); // מאחסן את שם המשתמש שהמשתמש מכניס
  const [password, setPassword] = useState(""); // מאחסן את הסיסמה שהמשתמש מכניס
  const navigate = useNavigate(); // hook לניווט בין דפים

  // פונקציה שמטפלת באירוע ההתחברות כאשר המשתמש לוחץ על הכפתור
  const handleLogin = (e) => {
    e.preventDefault(); // מונע רענון של הדף (ברירת המחדל של טופס)

    // בדיקת שם משתמש וסיסמה
    if (username === "admin" && password === "1234") {
      // אם שם המשתמש והסיסמה תואמים
      localStorage.setItem("isLoggedIn", "true"); // שומר מצב התחברות ב-localStorage (אפשרות בסיסית)
      navigate("/dashboard"); // מעביר את המשתמש לדף ה-Dashboard
    } else {
      // אם שם המשתמש או הסיסמה שגויים
      alert("שם משתמש או סיסמה שגויים!"); // מציג הודעת שגיאה
    }
  };

  return (
    // מבנה רספונסיבי עם Bootstrap
    <div className="container d-flex justify-content-center align-items-center vh-100">
      {/* הקופסה המרכזית של הטופס */}
      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        {/* כותרת הטופס */}
        <h2 className="text-center mb-4">התחברות</h2>
        {/* טופס ההתחברות */}
        <form onSubmit={handleLogin}>
          {/* שדה להזנת שם משתמש */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              שם משתמש
            </label>
            <input
              type="text" // סוג השדה: טקסט
              id="username" // מזהה ייחודי לשדה
              className="form-control" // מחלקת Bootstrap לעיצוב שדות
              value={username} // הערך הנוכחי של שם המשתמש (state)
              onChange={(e) => setUsername(e.target.value)} // מעדכן את ה-state עם הערך שהמשתמש מזין
              required // מוודא שהשדה חייב להיות מלא
            />
          </div>
          {/* שדה להזנת סיסמה */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              סיסמה
            </label>
            <input
              type="password" // סוג השדה: סיסמה
              id="password" // מזהה ייחודי לשדה
              className="form-control" // מחלקת Bootstrap לעיצוב שדות
              value={password} // הערך הנוכחי של הסיסמה (state)
              onChange={(e) => setPassword(e.target.value)} // מעדכן את ה-state עם הערך שהמשתמש מזין
              required // מוודא שהשדה חייב להיות מלא
            />
          </div>
          {/* כפתור התחברות */}
          <button type="submit" className="btn btn-primary w-100">
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
