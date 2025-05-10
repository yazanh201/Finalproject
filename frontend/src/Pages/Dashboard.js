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
import styles from "./cssfiles/Dashboard.module.css";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [selectedAppointmentNumber, setSelectedAppointmentNumber] = useState(null); // ✅ שליטה במספר תור עבור טיפולים
  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const [selectedTreatmentNumber, setSelectedTreatmentNumber] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);



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
      case "cars":
        return <CarsTable />;
      case "Customers":
        return <Customers />;
      case "Inquiries":
        return <Inquiries />;
      case "Treatments":
        return (
          <TreatmentsTable
            filterAppointment={selectedAppointmentNumber}
            filterTreatmentNumber={selectedTreatmentNumber}
            onNavigateToRepair={goToRepairType}
            onNavigateToAppointment={goToAppointment}
          />
        );
      case "Repairtypes":
        return (
          <Repairtypes
            filterRepairId={selectedRepairId}
            onNavigateToTreatment={goToTreatment}
          />
        );
      case "Appointments":
        return (
          <Appointment
            onSelectTreatment={(number) => {
              setSelectedAppointmentNumber(number);
              setActiveView("Treatments");
            }}
            filterAppointmentNumber={selectedAppointmentNumber}
          />
        );
      case "Employees":
        return <Employees />;
      case "CarsUnderMaintance":
        return <CarsUnderMaintance />;
      case "CarOrders":
        return <CarOrders />;
      default:
        return (
          <>
            <h3>ברוך הבא ללוח הבקרה</h3>
            <p>כאן תוכל לנהל את נתוני המוסך בהתאם להרשאות שלך.</p>
          </>
        );
    }
  };
  
  const goToRepairType = (repairId) => {
    setSelectedRepairId(repairId);
    setActiveView("Repairtypes");
  };

  const goToTreatment = async (treatmentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/treatments/by-id/${treatmentId}`);
      const data = await res.json();
      if (data && data.appointmentNumber) {
        setSelectedAppointmentNumber(data.appointmentNumber);
        setSelectedTreatmentNumber(data.treatmentId);  // ✅ סנן לפי טיפול מדויק
        setActiveView("Treatments");
      } else {
        alert("לא נמצא מזהה תור בטיפול זה");
      }
    } catch (err) {
      console.error("שגיאה בשליפת טיפול:", err);
      alert("❌ שגיאה בשליפת טיפול");
    }
  };

  const goToAppointment = (appointmentNumber) => {
    setSelectedAppointmentNumber(appointmentNumber);
    setSelectedTreatmentNumber(null); // כדי להציג את כל הטיפולים בתור
    setActiveView("Appointments");
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <button
          className={styles["navbar-toggler"]}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className={styles.dashboardTitle}>
          <h4>Dashboard</h4>
          <h5>תפקיד: {role === "admin" ? "מנהל" : "עובד"}</h5>
        </div>

        <div className={`${styles["navbar-collapse"]} ${isMenuOpen ? styles.show : ""}`}>
          {role === "admin" && (
            <Link to="/AdvancedDashboard" className={styles.headerLink}>
              <FaTachometerAlt className={styles.icon} /> לוח ניהול מתקדם
            </Link>
          
          )}
            <button onClick={handleLogout} className={styles.headerLinkLogout}>
              <FaSignOutAlt className={styles.icon} /> התנתקות
            </button>
        </div>
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
