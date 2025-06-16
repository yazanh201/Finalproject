import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import API_BASE from "../config";

const Login = () => {
  const [username, setUsername] = useState(""); // קלט שם משתמש
  const [password, setPassword] = useState(""); // קלט סיסמה
  const [error, setError] = useState(""); // הודעת שגיאה
  const navigate = useNavigate();

  // פונקציה שמבצעת התחברות לשרת
 const handleLogin = async (e) => {
  e.preventDefault();
  setError(""); // איפוס שגיאה קודמת

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "שגיאה בהתחברות");
      return;
    }

    console.log("Token:", data.token);
    console.log("Role:", data.role);

    // שמירת טוקן ו־role ב-localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("isLoggedIn", "true");

    navigate("/dashboard");

  } catch (err) {
    console.error("Login error:", err);
    setError("שגיאת רשת. נסה שוב מאוחר יותר.");
  }
};


  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
          <h2 className="text-center mb-4">התחברות</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">שם משתמש</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">התחבר</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
