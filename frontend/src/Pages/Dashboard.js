import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarsTable from "../Tabels/CarsTable"; // ייבוא הטבלה מתוך תיקיית tables
import "./Dashboard.css"; // ייבוא קובץ CSS מותאם לעיצוב הדף
import Customers from "../Tabels/CustomersTable";
import Inquiries from "../Tabels/Inquiries"; 
import TreatmentsTable from "../Tabels/TreatmentsTable";
import Appointment from "../Tabels/Appointments";
import Employees from "../Tabels/EmployeesTable";
import Repairtypes from "../Tabels/RepairtypesTable";
import CarsUnderMaintance from "../Tabels/CarsUnderMaintance";
import CarOrders from "../Tabels/CarOrders";

const Dashboard = () => {
  const navigate = useNavigate();

  // State לניהול תפקיד המשתמש ותוכן התצוגה
  const [role, setRole] = useState(""); // מחזיק את התפקיד של המשתמש: 'admin' או 'employee'
  const [activeView, setActiveView] = useState("home"); // תצוגה פעילה בדשבורד

  // שימוש ב-useEffect לבדיקה ראשונית של סטטוס התחברות ותפקיד
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // בדיקה אם המשתמש מחובר
    const userRole = localStorage.getItem("role"); // בדיקה מהו תפקיד המשתמש

    if (!isLoggedIn || !userRole) {
      // אם המשתמש לא מחובר או אין תפקיד מוגדר
      navigate("/login"); // מפנה לדף ההתחברות
    } else {
      setRole(userRole); // שומר את התפקיד של המשתמש ב-state
    }
  }, [navigate]);

  // פונקציה לטיפול בהתנתקות המשתמש
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // מסיר את הסטטוס שהמשתמש מחובר
    localStorage.removeItem("role"); // מסיר את התפקיד של המשתמש
    navigate("/login"); // מפנה לדף ההתחברות
  };

  // פונקציה להצגת התוכן בהתאם לתצוגה הפעילה
  const renderContent = () => {
    switch (activeView) {
      case "cars":
        return (
          <>
            <CarsTable />
          </>
        );
      case "home":
      default:
        return (
          <>
            <h3>ברוך הבא ללוח הבקרה</h3>
            <p>כאן תוכל לנהל את נתוני המוסך בהתאם להרשאות שלך.</p>
          </>
        );
      case "Customers":
        return (
          <>
          <Customers />
          </>
        );
      case "Inquiries":
        return(
          <>
          <Inquiries />
          </>
        );
      case "Treatments":
        return(
          <>
          <TreatmentsTable />
          </>
        );
      case "Appointments":
        return (
          <>
          <Appointment />
          </>
        );
      case "Employees":
        return(
          <>
          <Employees />
          </>
        );
      case "Repairtypes":
        return(
          <>
          <Repairtypes />
          </>
        );
      case "CarsUnderMaintance":
        return(
          <>
          <CarsUnderMaintance/>
          </>
        );
        case "CarOrders":
          return(
            <>
            <CarOrders/>
            </>
          )

    }
  };

  return (
    <div className="dashboard-container">
      {/* כותרת עליונה */}
      <header className="header bg-light text-dark py-2 px-4 d-flex align-items-center">
        <div className="container text-center   ">
          {/* הצגת כותרת ותפקיד המשתמש */}
          <h4 className="m-0 py-2" id="dash">Dashboard</h4>
          <h5 className="m-0">תפקיד: {role === "admin" ? "מנהל" : "עובד"}</h5>
        </div>
        <div className="logout-button">
          {/* כפתור התנתקות */}
          <button className="btn btn-danger" onClick={handleLogout}>
            התנתק
          </button>
        </div>
      </header>

      <div className="d-flex">
        {/* תפריט צדדי */}
        <nav className="sidebar bg-dark text-light p-1 vh-100">
          <ul className="nav flex-column">
            {/* תפריט מנהל */}
            {role === "admin" && (
              <>
                <li className="nav-item mb-2">
                  <button
                    className="btn btn-dark "
                    onClick={() => setActiveView("cars")}
                  >
                    רכבים
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button className="btn btn-dark" onClick={() => setActiveView("Customers")}>לקוחות</button>
                </li>
                <li className="nav-item mb-2">
                  <button className="btn btn-dark " onClick={() => setActiveView("Inquiries")}>פניות</button>
                </li>
                <li className="nav-item mb-2">
                  <button className="btn btn-dark " onClick={() => setActiveView("CarOrders ")}>הזמנות לרכבים</button>
                </li>
                <li className="nav-item mb-2">
                  <button className="btn btn-dark " onClick={() => setActiveView("Appointments")}>תורים</button>
                </li>
                <li className="nav-item mb-2">
                  <button className="btn btn-dark " onClick={() => setActiveView("Employees")}>עובדים</button>
                </li>
              </>
            )}

            {/* תפריט לעובד ולמנהל */}
            <li className="nav-item mb-2">
              <button className="btn btn-dark" onClick={() => setActiveView("Treatments")}>טיפולים</button>
            </li>
            <li className="nav-item mb-2">
              <button className="btn btn-dark " onClick={() => setActiveView("CarsUnderMaintance")}>רכבים בטיפול</button>
            </li>
            <li className="nav-item mb-2">
              <button className="btn btn-dark " onClick={() => setActiveView("Repairtypes")}>סוגי טיפולים/תיקונים</button>
            </li>
          </ul>
        </nav>

        {/* תוכן מרכזי */}
        <main className="main-content flex-grow-1 p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;