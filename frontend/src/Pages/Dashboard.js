import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./cssfiles/Dashboard.module.css";

import CarsTable from "../Tabels/CarsTable";
import Customers from "../Tabels/CustomersTable";
import Inquiries from "../Tabels/Inquiries";
import TreatmentsTable from "../Tabels/TreatmentsTable";
import Appointment from "../Tabels/Appointments";
import Employees from "../Tabels/EmployeesTable";
import CarsUnderMaintance from "../Tabels/CarsUnderMaintance";
import CarOrders from "../Tabels/CarOrders";
import CameraPanel from "../components/CameraPanel";

import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [selectedAppointmentNumber, setSelectedAppointmentNumber] = useState(null);
  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const [selectedTreatmentNumber, setSelectedTreatmentNumber] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTimeoutRef = useRef(null);

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

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const renderContent = () => {
    switch (activeView) {
      case "cars":
        return <div className={styles.card}><CarsTable /></div>;
      case "Customers":
        return <div className={styles.card}><Customers /></div>;
      case "Inquiries":
        return <div className={styles.card}><Inquiries /></div>;
      case "Treatments":
        return (
          <div className={styles.card}>
            <TreatmentsTable
              filterAppointment={selectedAppointmentNumber}
              filterTreatmentNumber={selectedTreatmentNumber}
              onNavigateToRepair={goToRepairType}
              onNavigateToAppointment={goToAppointment}
            />
          </div>
        );
      case "Repairtypes":
        return (
          <div className={styles.card}>
            <Repairtypes
              filterRepairId={selectedRepairId}
              onNavigateToTreatment={goToTreatment}
            />
          </div>
        );
      case "Appointments":
        return (
          <div className={styles.card}>
            <Appointment
              onSelectTreatment={(number) => {
                setSelectedAppointmentNumber(number);
                setActiveView("Treatments");
              }}
              filterAppointmentNumber={selectedAppointmentNumber}
            />
          </div>
        );
      case "Employees":
        return <div className={styles.card}><Employees /></div>;
      case "CarsUnderMaintance":
        return <div className={styles.card}><CarsUnderMaintance /></div>;
      case "CarOrders":
        return <div className={styles.card}><CarOrders /></div>;
      default:
        return (
          <div className={styles.card}>
            <h3>ברוך הבא ללוח הבקרה</h3>
            <p>כאן תוכל לנהל את נתוני המוסך בהתאם להרשאות שלך.</p>
          </div>
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
        setSelectedTreatmentNumber(data.treatmentId);
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
    setSelectedTreatmentNumber(null);
    setActiveView("Appointments");
  };

  // Sidebar mobile overlay
  const handleSidebarOverlayClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <button
          className={styles["navbar-toggler"]}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="פתח תפריט"
        >
          <span className={styles.hamburgerIcon}></span>
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

          <div
            className={styles.dropdownWrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className={styles.headerLink}>⚙️ פעולות נוספות</button>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                {role === "admin" ? (
                  <>
                    <button className={styles.dropdownItem} onClick={() => navigate("/add-customer-with-vehicle")}>➕ הוספת לקוח ורכב</button>
                    <button className={styles.dropdownItem} onClick={() => navigate("/create-treatment")}>➕ הוספת טיפול חדש</button>
                    <button className={styles.dropdownItem} onClick={() => navigate("/AppointmentForm")}>➕ קביעת תור</button>
                    <button className={styles.dropdownItem} onClick={() => setShowCamera(true)}>📸 הפעל מצלמה</button>
                    <button onClick={handleLogout} className={styles.headerLinkLogout}>
                      <FaSignOutAlt className={styles.icon} /> התנתקות
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.dropdownItem} onClick={() => setShowCamera(true)}>📸 הפעל מצלמה</button>
                    <button onClick={handleLogout} className={styles.headerLinkLogout}>
                      <FaSignOutAlt className={styles.icon} /> התנתקות
                    </button>
                  </>
                )}
              </div>

            )}
          </div>
        </div>
      </header>

      <div className={styles.mainWrapper}>
        {/* Sidebar overlay for mobile */}
        {isMenuOpen && (
          <div className={styles.sidebarOverlay} onClick={handleSidebarOverlayClick}></div>
        )}
        <nav className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ""}`}>
          <ul className={styles.navList}>
            {role === "admin" && (
              <>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("Customers"); setIsMenuOpen(false); }}>לקוחות</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("cars"); setIsMenuOpen(false); }}>רכבים</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("Inquiries"); setIsMenuOpen(false); }}>פניות</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("CarOrders"); setIsMenuOpen(false); }}>הזמנות לרכבים</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("Appointments"); setIsMenuOpen(false); }}>תורים</button></li>
                <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("Employees"); setIsMenuOpen(false); }}>עובדים</button></li>
              </>
            )}
            <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("Treatments"); setIsMenuOpen(false); }}>טיפולים</button></li>
            <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("CarsUnderMaintance"); setIsMenuOpen(false); }}>רכבים בטיפול</button></li>
          </ul>
        </nav>

        <main className={styles.mainContent}>
          {renderContent()}
        </main>

        {showCamera && (
          <CameraPanel onClose={() => setShowCamera(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;