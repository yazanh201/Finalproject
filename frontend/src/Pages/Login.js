import React, { useState } from "react"; // יבוא React ו־useState לניהול מצבים
import { useNavigate } from "react-router-dom"; // hook לניווט בין דפים
import API_BASE from "../config"; // יבוא כתובת בסיסית ל־API
import toast, { Toaster } from 'react-hot-toast'; // ספרייה להצגת הודעות קופצות

const Login = () => {
  // משתנים למילוי הטופס והודעות שגיאה
  const [username, setUsername] = useState(""); // שם משתמש
  const [password, setPassword] = useState(""); // סיסמה
  const [error, setError] = useState(""); // הודעת שגיאה
  const navigate = useNavigate(); // יצירת פונקציית ניווט

  // פונקציית התחברות
  const handleLogin = async (e) => {
    e.preventDefault(); // מניעת רענון דף

    try {
      // שליחת בקשת POST לשרת עם שם המשתמש והסיסמה
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json(); // קבלת תשובה מהשרת

      // טיפול בשגיאה מהשרת
      if (!response.ok) {
        toast.error(data.message || "שגיאה בהתחברות");
        return;
      }

      // שמירת פרטי התחברות בלוקאל סטורג'
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("isLoggedIn", "true");

      toast.success("התחברת בהצלחה!"); // הצגת הודעת הצלחה
      navigate("/dashboard"); // מעבר לדשבורד
    } catch (err) {
      console.error("Login error:", err); // הדפסת שגיאה לקונסול
      toast.error("שגיאת רשת. נסה שוב מאוחר יותר."); // הודעת שגיאה למשתמש
    }
  };

  return (
    <>
      {/* רכיב שמציג את ההודעות הקופצות של toast */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* מרכז עמוד ההתחברות עם עיצוב Bootstrap */}
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
          <h2 className="text-center mb-4">התחברות</h2>
          
          {/* טופס התחברות */}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">שם משתמש</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // עדכון סטייט
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">סיסמה</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // עדכון סטייט
                required
              />
            </div>

            {/* הצגת הודעת שגיאה אם יש */}
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            {/* כפתור התחברות */}
            <button type="submit" className="btn btn-primary w-100">התחבר</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login; // ייצוא הקומפוננטה
