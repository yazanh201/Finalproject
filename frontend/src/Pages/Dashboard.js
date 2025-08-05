// ייבוא React hooks ורכיבים נוספים
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./cssfiles/Dashboard.module.css";

// ייבוא טבלאות ורכיבים נוספים מתוך הפרויקט
import CarsTable from "../Tabels/CarsTable";
import Customers from "../Tabels/CustomersTable";
import Inquiries from "../Tabels/Inquiries";
import TreatmentsTable from "../Tabels/TreatmentsTable";
import Appointment from "../Tabels/Appointments";
import Employees from "../Tabels/EmployeesTable";
import CarsUnderMaintance from "../Tabels/CarsUnderMaintance";
import CarOrders from "../Tabels/CarOrders";
import CameraPanel from "../components/CameraPanel";

// אייקונים
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

// קומפוננטת לוח הבקרה הראשי
const Dashboard = () => {
  const navigate = useNavigate();

  // משתני סטייט לניהול הרשאות, תצוגות, בחירות וכו'
  const [role, setRole] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [selectedAppointmentNumber, setSelectedAppointmentNumber] = useState(null);
  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const [selectedTreatmentNumber, setSelectedTreatmentNumber] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownTimeoutRef = useRef(null);

  // בודק אם המשתמש מחובר – אם לא, מעביר למסך התחברות
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("role");

    if (!isLoggedIn || !userRole) {
      navigate("/login");
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  // יציאה מהמערכת
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // הצגת תפריט נפתח בעכבר
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setShowDropdown(true);
  };

  // הסתרת תפריט נפתח בעכבר לאחר השהייה
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  // הצגת התוכן הראשי לפי התצוגה הנבחרת (state של activeView)
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
        // תצוגת ברירת מחדל – מסך הבית
        return (
          <div className={styles.card}>
            <h3>ברוך הבא ללוח הבקרה</h3>
            <p>כאן תוכל לנהל את נתוני המוסך בהתאם להרשאות שלך.</p>
          </div>
        );
    }
  };

  // ניווט לתצוגת סוגי טיפולים (Repairtypes)
  const goToRepairType = (repairId) => {
    setSelectedRepairId(repairId);
    setActiveView("Repairtypes");
  };

  // ניווט חכם לטיפול לפי מזהה (כולל קישור לתור)
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

  // ניווט חזרה לתור ספציפי מתוך טיפול
  const goToAppointment = (appointmentNumber) => {
    setSelectedAppointmentNumber(appointmentNumber);
    setSelectedTreatmentNumber(null);
    setActiveView("Appointments");
  };

  // בעת לחיצה על רקע כהה בתפריט צד (בנייד) – סוגר תפריט
  const handleSidebarOverlayClick = () => {
    setIsMenuOpen(false);
  };


  return (
  <div className={styles.dashboardContainer}>
    {/* כותרת לוח הבקרה – כוללת כפתור תפריט, תפקיד המשתמש וקישורים */}
    <header className={styles.header}>
      {/* כפתור תפריט לנייד (hamburger) */}
      <button
        className={styles["navbar-toggler"]}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="פתח תפריט"
      >
        <span className={styles.hamburgerIcon}></span>
      </button>

      {/* כותרת לוח הבקרה עם תפקיד המשתמש */}
      <div className={styles.dashboardTitle}>
        <h4>Dashboard</h4>
        <h5>תפקיד: {role === "admin" ? "מנהל" : "עובד"}</h5>
      </div>

      {/* תפריט ניווט עליון שמופיע בהתאם להרשאות ולמצב פתיחה */}
      <div className={`${styles["navbar-collapse"]} ${isMenuOpen ? styles.show : ""}`}>
        {/* אם המשתמש הוא מנהל – הצג קישור ללוח מתקדם */}
        {role === "admin" && (
          <Link to="/AdvancedDashboard" className={styles.headerLink}>
            <FaTachometerAlt className={styles.icon} /> לוח ניהול מתקדם
          </Link>
        )}

        {/* תפריט נפתח – פעולות נוספות */}
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
                  {/* כפתורים למנהל בלבד */}
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
                  {/* כפתורים לעובדים */}
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

    {/* תוכן ראשי של הדשבורד */}
    <div className={styles.mainWrapper}>
      {/* שכבת רקע לסגירת סיידבר במובייל */}
      {isMenuOpen && (
        <div className={styles.sidebarOverlay} onClick={handleSidebarOverlayClick}></div>
      )}

      {/* סיידבר ניווט ראשי */}
      <nav className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ""}`}>
        <ul className={styles.navList}>
          {/* תפריט מלא למנהל */}
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

          {/* פריטים שכולם רואים */}
          <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("Treatments"); setIsMenuOpen(false); }}>טיפולים</button></li>
          <li className={styles.navItem}><button className={styles.sidebarBtn} onClick={() => { setActiveView("CarsUnderMaintance"); setIsMenuOpen(false); }}>רכבים בטיפול</button></li>
        </ul>
      </nav>

      {/* תוכן משתנה לפי התצוגה הנבחרת */}
      <main className={styles.mainContent}>
        {renderContent()}
      </main>

      {/* פאנל מצלמה אם הופעל */}
      {showCamera && (
        <CameraPanel onClose={() => setShowCamera(false)} />
      )}
    </div>
  </div>
);

};

export default Dashboard;