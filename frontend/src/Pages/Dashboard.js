import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarsTable from "../Tabels/CarsTable";
import Customers from "../Tabels/CustomersTable";
import Inquiries from "../Tabels/Inquiries"; 
import TreatmentsTable from "../Tabels/TreatmentsTable";
import Appointment from "../Tabels/Appointments";
import Employees from "../Tabels/EmployeesTable";
import Repairtypes from "../Tabels/RepairtypesTable";
import CarsUnderMaintance from "../Tabels/CarsUnderMaintance";
import CarOrders from "../Tabels/CarOrders";
import styles from "./Dashboard.module.css"; // ✅ שימוש ב-CSS Modules

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(""); 
  const [activeView, setActiveView] = useState("home");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("role");

    if (!isLoggedIn || !userRole) {
      navigate("/login");
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeView) {
      case "cars": return <CarsTable />;
      case "Customers": return <Customers />;
      case "Inquiries": return <Inquiries />;
      case "Treatments": return <TreatmentsTable />;
      case "Appointments": return <Appointment />;
      case "Employees": return <Employees />;
      case "Repairtypes": return <Repairtypes />;
      case "CarsUnderMaintance": return <CarsUnderMaintance />;
      case "CarOrders": return <CarOrders />;
      default:
        return (
          <>
            <h3>ברוך הבא ללוח הבקרה</h3>
            <p>כאן תוכל לנהל את נתוני המוסך בהתאם להרשאות שלך.</p>
          </>
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
      {role === "admin" && (
      <button className={styles.advancedDashboardBtn} onClick={() => navigate("/AdvancedDashboard")}>
        לוח ניהול מתקדם
      </button>
    )}
        <div className={styles.dashboardTitle}>
          <h4>Dashboard</h4>
          <h5>תפקיד: {role === "admin" ? "מנהל" : "עובד"}</h5>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>התנתק</button>
      </header>

      <div className={styles.mainWrapper}>
        <nav className={styles.sidebar}>
          <ul className={styles.navList}>
            {role === "admin" && (
              <>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("cars")}>רכבים</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("Customers")}>לקוחות</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("Inquiries")}>פניות</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("CarOrders")}>הזמנות לרכבים</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("Appointments")}>תורים</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("Employees")}>עובדים</button></li>
              </>
            )}
            <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("Treatments")}>טיפולים</button></li>
            <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("CarsUnderMaintance")}>רכבים בטיפול</button></li>
            <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => setActiveView("Repairtypes")}>סוגי טיפולים/תיקונים</button></li>
          </ul>
        </nav>

        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
