import React, { useState, useEffect, useRef } from "react"; // ייבוא React ו-hooks לניהול state ו-ref
import styles from "../cssfiles/Advanceddashboard.module.css"; // ייבוא קובץ עיצוב לקומפוננטה
import { useNavigate } from "react-router-dom"; // ניווט בין דפים
import { FaArrowLeft } from "react-icons/fa"; // אייקון חץ אחורה

// ייבוא תתי קומפוננטות של הדשבורד
import DashboardOverview from "./DashboardOverview";
import DashboardTables from "./DashboardTables";
import MonthlyAppointments from "../tabels/MonthlyAppointments";
import NewCustomers from "../tabels/NewCustomers";
import TodayAppointments from "../tabels/TodayAppointments";
import RevenueByRepairTypeChart from "./charts/RevenueByRepairTypeChart";
import TreatmentTypePieChart from "./charts/TreatmentTypePieChart";
import ArrivedCars from "../tabels/ArrivedCars";
import CompletedTreatments from "../tabels/CompletedTreatments";
import useNotifications from "./useNotifications"; // hook לניהול התראות
import CarsUnderService from "../tabels/CarsUnderService";
import RecommendedCars from "../tabels/RecommendedCars";
import MonthlyRevenueTable from "../tabels/MonthlyRevenueTable";
import InvoicesTable from "../tabels/InvoicesTable";

const AdvancedDashboard = () => {
  const navigate = useNavigate(); // ניווט בין דפים
  const tableRef = useRef(null); // הפניה ל-scroll לטבלה בעת לחיצה

  // סטייטים לניהול נתונים וסטטיסטיקות
  const [stats, setStats] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableTitle, setTableTitle] = useState("");
  const [monthlyAppointmentCount, setMonthlyAppointmentCount] = useState(0);
  const [newCustomersCount, setNewCustomersCount] = useState(0);
  const [dynamicTableHeaders, setDynamicTableHeaders] = useState([]);
  const { activeNotifications, addNotification } = useNotifications(); // ניהול התראות
  const [carsInServiceCount, setCarsInServiceCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // useEffect ראשון - טוען נתונים ברגע טעינת הקומפוננטה
  useEffect(() => {
    const fetchData = async () => {
      try {
        // שליפה מקבילה של שלושת הנתונים הדרושים: לקוחות, תורים, טיפולים
        const [customersRes, appointmentsRes, treatmentsRes] = await Promise.all([
          fetch("https://garage-backend-o8do.onrender.com/api/customers/new-this-month"),
          fetch("https://garage-backend-o8do.onrender.com/api/appointments/month"),
          fetch("https://garage-backend-o8do.onrender.com/api/treatments")
        ]);

        // המרת התגובה ל-JSON
        const customersData = await customersRes.json();
        const appointmentsData = await appointmentsRes.json();
        const treatmentsData = await treatmentsRes.json();

        // סטטיסטיקות בסיסיות
        setNewCustomersCount(customersData.length);
        setMonthlyAppointmentCount(appointmentsData.length);

        // חישוב רכבים שעדיין בטיפול
        const underServiceCount = treatmentsData.filter(t => t.status !== "הסתיים").length;
        setCarsInServiceCount(underServiceCount);

        // חישוב סך ההכנסות מהחודש הנוכחי
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const thisMonthTreatments = treatmentsData.filter(t => {
          const treatmentDate = new Date(t.date);
          return (
            treatmentDate.getMonth() === currentMonth &&
            treatmentDate.getFullYear() === currentYear
          );
        });

        const totalRevenue = thisMonthTreatments.reduce((sum, t) => {
          return sum + (Number(t.cost) || 0);
        }, 0);
        setMonthlyRevenue(totalRevenue);

        // ✅ התראות על טיפולים שהסתיימו היום או אתמול
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        const completedRecent = treatmentsData.filter(t =>
          t.status === "הסתיים" &&
          (new Date(t.updatedAt).toISOString().slice(0, 10) === today ||
           new Date(t.updatedAt).toISOString().slice(0, 10) === yesterday)
        );

        if (completedRecent.length > 0) {
          const details = completedRecent.map(t => ({
            מזהה: t.treatmentNumber,
            רכב: t.carPlate,
            לקוח: t.customerName
          }));
          addNotification("completedTreatments", { details });
        }

      } catch (error) {
        console.error("❌ Error loading stats:", error); // טיפול בשגיאות
      }
    };

    fetchData();
  }, []);

  // useEffect שני - עדכון רשימת הסטטיסטיקות כאשר הנתונים משתנים
  useEffect(() => {
    setStats([
      { title: "סה״כ תורים לחודש", value: monthlyAppointmentCount, key: "appointments" },
      { title: "רכבים בטיפול", value: carsInServiceCount, key: "carsUnderService" },
      { title: "לקוחות חדשים", value: newCustomersCount, key: "newCustomers" },
      { title: "הכנסות החודש (₪)", value: monthlyRevenue, key: "income" }
    ]);
  }, [monthlyAppointmentCount, newCustomersCount, carsInServiceCount]);

  // טיפול בלחיצה על כפתור סטטיסטיקה (מחליף את הטבלה שמוצגת)
  const showTable = (key) => {
    switch (key) {
      case "recommendedCars":
        setSelectedTable("recommendedCars");
        break;
      case "newCustomers":
        setSelectedTable("newCustomers");
        break;
      case "todayAppointments":
        setSelectedTable("todayAppointments");
        break;
      case "carsUnderService":
        setSelectedTable("carsUnderService");
        break;
      case "appointments":
        setSelectedTable("monthlyAppointments");
        break;
      case "income":
        setSelectedTable("monthlyRevenue");
        break;
      default:
        setTableData([]);
        setSelectedTable(null);
        break;
    }
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth" }); // גלילה לטבלה
    }, 300);
  };

  // מיפוי כותרות דינמיות לטבלאות
  const tableHeaders = {
    recommendedCars: ["מספר רכב", "בעלים", "קילומטרים משוערים", "חודשים מהטיפול האחרון"],
    newCustomers: ["שם", "טלפון", "תאריך הצטרפות"],
    carsUnderMaintenance: ["רכב", "סיבה", "איחור", "לוחית"]
  };

  // טיפול בלחיצה על התראה – מעבר אוטומטי לטבלה או תצוגה רלוונטית
  const handleNotificationClick = (type, data) => {
    if (type === "newTreatment") {
      setSelectedTable("arrivedCars");
    } else if (type === "completedTreatments") {
      setSelectedTable("completedTreatments");
    } else if (data) {
      setTableTitle("\uD83D\uDD27 פרטי רכב שנכנס לטיפול");
      setDynamicTableHeaders(Object.keys(data));
      setTableData([data]);
      setSelectedTable("dynamic");
    } else {
      showTable(type); // מעבר לפי סוג ההתראה
    }
  };


  return (
  // 📦 מיכל ראשי של הדשבורד המתקדם
  <div className={styles.dashboardContainer}>

    {/* 🧭 כותרת עליונה עם שם הדשבורד וכפתור חזרה */}
    <header className={`${styles.dashboardHeader} d-flex justify-content-between align-items-center p-3 sticky-top`} dir="rtl">
      <button className={`${styles.hamburgerBtn} d-md-none btn`} onClick={() => setIsMobileMenuOpen(true)}>
        ☰
      </button>

      <h2 className={`${styles.headerTitle} text-center m-0 flex-grow-1`}>
        <span role="img" aria-label="dashboard"></span> לוח ניהול מתקדם
      </h2>

      <button className={`${styles.backBtn} btn`} onClick={() => navigate("/dashboard")}>
        <FaArrowLeft className={styles.icon} /> חזור לדשבורד
      </button>
    </header>


    {isMobileMenuOpen && (
      <div className={styles.mobileSidebar}>
        <button
          className={styles.closeBtn}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ✕
        </button>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <button
              className={styles.sidebarBtn}
              onClick={() => {
                showTable("recommendedCars");
                setIsMobileMenuOpen(false);
              }}
            >
               רכבים מומלצים
            </button>
          </li>
          <li className={styles.navItem}>
            <button
              className={styles.sidebarBtn}
              onClick={() => {
                showTable("todayAppointments");
                setIsMobileMenuOpen(false);
              }}
            >
               תורים להיום
            </button>
          </li>
          <li className={styles.navItem}>
            <button
              className={styles.sidebarBtn}
              onClick={() => {
                navigate("/monthlyreport");
                setIsMobileMenuOpen(false);
              }}
            >
               דוח חודשי
            </button>
          </li>
          <li className={styles.navItem}>
            <button
              className={styles.sidebarBtn}
              onClick={() => {
                setSelectedTable("invoices");
                setIsMobileMenuOpen(false);
              }}
            >
               חשבוניות
            </button>
          </li>
        </ul>
      </div>
    )}

    {/* 📌 סרגל צד שמכיל ניווט בין טבלאות/דפים שונים */}
    <aside className={styles.sidebar}>
      <ul className={styles.navList}>
        {/* כפתור לרכבים מומלצים */}
        <li className={styles.navItem}>
          <button className={styles.sidebarBtn} onClick={() => showTable("recommendedCars")}>
            <span role="img" aria-label="car"></span> רכבים מומלצים
          </button>
        </li>

        {/* כפתור לתורים של היום */}
        <li className={styles.navItem}>
          <button className={styles.sidebarBtn} onClick={() => showTable("todayAppointments")}>
            <span role="img" aria-label="calendar"></span> תורים להיום
          </button>
        </li>

        {/* כפתור לדוח חודשי – ניווט לעמוד אחר */}
        <li className={styles.navItem}>
          <button
            className={styles.sidebarBtn}
            onClick={() => navigate("/monthlyreport")}
          >
            <span role="img" aria-label="calendar"></span> דוח חודשי
          </button>
        </li>

        {/* כפתור לטבלת חשבוניות */}
        <li className={styles.navItem}>
          <button className={styles.sidebarBtn} onClick={() => setSelectedTable("invoices")}>
            <span role="img" aria-label="invoice"></span> חשבוניות
          </button>
        </li>
      </ul>
    </aside>

    {/* 🧾 תוכן עיקרי – כולל גרפים, נתונים וטבלאות */}
    <main className={styles.mainContent}>

      {/* 📊 הצגת שני גרפים: עוגה ועמודות */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartBox}>
          <TreatmentTypePieChart />
        </div>
        <div className={styles.chartBox}>
          <RevenueByRepairTypeChart />
        </div>
      </div>

      {/* 💡 סיכום סטטיסטיקות + התראות + אפשרות לחיצה על כל אחד */}
      <DashboardOverview
        stats={stats}
        notifications={activeNotifications}
        onStatClick={showTable}
        onNotificationClick={(type, data) => handleNotificationClick(type, data)}
      />

      {/* 📋 הצגת טבלה לפי הבחירה הנוכחית (selectedTable) */}
      <div ref={tableRef}>
        {selectedTable === "monthlyAppointments" ? (
          <MonthlyAppointments onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "newCustomers" ? (
          <NewCustomers onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "todayAppointments" ? (
          <TodayAppointments onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "arrivedCars" ? (
          <ArrivedCars onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "completedTreatments" ? (
          <CompletedTreatments onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "carsUnderService" ? (
          <CarsUnderService onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "recommendedCars" ? (
          <RecommendedCars onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "monthlyRevenue" ? (
          <MonthlyRevenueTable onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "invoices" ? (
          // ✅ טבלת חשבוניות
          <InvoicesTable onClose={() => setSelectedTable(null)} />
        ) : (
          // 🧠 טבלה דינמית בהתבסס על נתונים (משתמשים, רכבים וכו')
          <DashboardTables
            tableTitle={tableTitle}
            tableData={tableData}
            tableHeaders={
              selectedTable === "dynamic"
                ? dynamicTableHeaders
                : tableHeaders[selectedTable]
            }
            onClose={() => setSelectedTable(null)}
          />
        )}
      </div>
    </main>
  </div>
);

};

export default AdvancedDashboard;