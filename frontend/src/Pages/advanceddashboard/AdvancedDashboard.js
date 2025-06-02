import React, { useState, useEffect, useRef } from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import DashboardOverview from "./DashboardOverview";
import DashboardTables from "./DashboardTables";
import MessageModal from "./MessageModal";
import MonthlyAppointments from "../tabels/MonthlyAppointments";
import NewCustomers from "../tabels/NewCustomers";
import TodayAppointments from "../tabels/TodayAppointments";
import RevenueByRepairTypeChart from "./charts/RevenueByRepairTypeChart";
import TreatmentTypePieChart from "./charts/TreatmentTypePieChart";
import ArrivedCars from "../tabels/ArrivedCars";
import CompletedTreatments from "../tabels/CompletedTreatments";
import useNotifications from "./useNotifications";
import CarsUnderService from "../tabels/CarsUnderService"; // ודא נתיב נכון


const AdvancedDashboard = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [stats, setStats] = useState([]);
  const [delayedTreatments, setDelayedTreatments] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableTitle, setTableTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [monthlyAppointmentCount, setMonthlyAppointmentCount] = useState(0);
  const [newCustomersCount, setNewCustomersCount] = useState(0);
  const [dynamicTableHeaders, setDynamicTableHeaders] = useState([]);
  const { activeNotifications, fetchCompletedTreatments } = useNotifications();
  const [carsInServiceCount, setCarsInServiceCount] = useState(0);


  // קריאה לבדיקה והתראה על טיפולים שהסתיימו
  useEffect(() => {
    fetchCompletedTreatments();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, appointmentsRes, treatmentsRes] = await Promise.all([
          fetch("http://localhost:5000/api/customers/new-this-month"),
          fetch("http://localhost:5000/api/appointments/month"),
          fetch("http://localhost:5000/api/treatments") // 🔥 הוספת קריאת טיפולים
        ]);
        const customersData = await customersRes.json();
        const appointmentsData = await appointmentsRes.json();
        const treatmentsData = await treatmentsRes.json();

        setNewCustomersCount(customersData.length);
        setMonthlyAppointmentCount(appointmentsData.length);

        const underServiceCount = treatmentsData.filter(t => t.status !== "הסתיים").length;
        setCarsInServiceCount(underServiceCount); // 🔥 נוסיף משתנה סטייט carsInServiceCount
      } catch (error) {
        console.error("❌ Error loading stats:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    setStats([
  { title: "סה״כ תורים לחודש", value: monthlyAppointmentCount, key: "appointments" },
  { title: "רכבים בטיפול", value: carsInServiceCount, key: "carsUnderService" },
  { title: "לקוחות חדשים", value: newCustomersCount, key: "newCustomers" },
  { title: "הכנסות החודש (₪)", value: 12000, key: "income" },
  { title: "טיפולים שהתעכבו", value: 2, key: "delayedTreatments" },
]);
  }, [monthlyAppointmentCount, newCustomersCount,carsInServiceCount]);

  useEffect(() => {
    const today = new Date();
    const cars = [
      { id: 1, owner: "ישראל כהן", plateNumber: "123-45-678", lastServiceDate: "2025-08-10", lastKm: 20000, avgMonthlyKm: 2000 },
      { id: 2, owner: "דני לוי", plateNumber: "987-65-432", lastServiceDate: "2023-06-15", lastKm: 45000, avgMonthlyKm: 1800 },
      { id: 3, owner: "מיכל לוי", plateNumber: "789-12-345", lastServiceDate: "2023-10-01", lastKm: 30000, avgMonthlyKm: 2200 },
    ];

    const filteredCars = cars.map((car) => {
      const lastServiceDate = new Date(car.lastServiceDate);
      const monthsSinceService = (today.getFullYear() - lastServiceDate.getFullYear()) * 12 +
        (today.getMonth() - lastServiceDate.getMonth());
      const estimatedKm = car.lastKm + monthsSinceService * car.avgMonthlyKm;
      const needsService = monthsSinceService >= 6 || estimatedKm - car.lastKm >= 15000;
      return needsService ? {
        "מספר רכב": car.plateNumber,
        "בעלים": car.owner,
        "קילומטרים משוערים": estimatedKm.toLocaleString(),
        "חודשים מהטיפול האחרון": monthsSinceService
      } : null;
    }).filter(Boolean);

    setRecommendedCars(filteredCars);
  }, []);

  const showTable = (key) => {
    switch (key) {
      case "recommendedCars":
        setTableData(recommendedCars);
        setTableTitle("רכבים מומלצים לבדיקה");
        break;
      case "newCustomers":
        setSelectedTable("newCustomers");
        return;
      case "todayAppointments":
        setSelectedTable("todayAppointments");
        return;
      case "carsUnderService": // 🚀 המפתח החדש
        setSelectedTable("carsUnderService"); // הפעלת הקומפוננטה החדשה
        return;
      case "delayedTreatments":
        setTableData(delayedTreatments);
        setTableTitle("טיפולים שהתעכבו");
        break;
      case "appointments":
        setSelectedTable("monthlyAppointments");
        return;
      default:
        setTableData([]);
        setSelectedTable(null);
        return;
    }
  };




  const tableHeaders = {
    recommendedCars: ["מספר רכב", "בעלים", "קילומטרים משוערים", "חודשים מהטיפול האחרון"],
    newCustomers: ["שם", "טלפון", "תאריך הצטרפות"],
    carsUnderMaintenance: ["רכב", "סיבה", "איחור", "לוחית"],
    delayedTreatments: ["רכב", "סיבה", "איחור", "לוחית"]
  };

const handleNotificationClick = (type, data) => {
  if (type === "newTreatment") {
    setSelectedTable("arrivedCars");
  } else if (type === "completedTreatments") {
    setSelectedTable("completedTreatments"); // הוספה חדשה להצגת טיפולים שהסתיימו
  } else if (data) {
    setTableTitle("🔧 פרטי רכב שנכנס לטיפול");
    setDynamicTableHeaders(Object.keys(data));
    setTableData([data]);
    setSelectedTable("dynamic");
  } else {
    showTable(type);
  }
};




    return (
      <div className={styles.dashboardContainer}>
        <header className={styles.dashboardHeader}>
          <h2 className={styles.headerTitle}>לוח ניהול מתקדם</h2>
          <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
            <FaArrowLeft className={styles.icon} /> חזור לדשבורד
          </button>
        </header>

        <aside className={styles.sidebar}>
  <ul className={styles.navList}>
    <li className={styles.navItem}>
      <button className={styles.sidebarBtn} onClick={() => setIsModalOpen(true)}>
         שליחת הודעות
      </button>
    </li>
    <li className={styles.navItem}>
      <button className={styles.sidebarBtn} onClick={() => showTable("recommendedCars")}>
         רכבים מומלצים
      </button>
    </li>
    <li className={styles.navItem}>
      <button className={styles.sidebarBtn}>
        הורדת דוח חודשי
      </button>
    </li>
    <li className={styles.navItem}>
      <button className={styles.sidebarBtn} onClick={() => showTable("todayAppointments")}>
         תורים להיום
      </button>
    </li>
  </ul>
</aside>



        <main className={styles.mainContent}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '20px'
          }}>
            <TreatmentTypePieChart />
            <RevenueByRepairTypeChart />
          </div>


          <DashboardOverview
            stats={stats}
            notifications={activeNotifications}
            onStatClick={showTable}
            onNotificationClick={(type, data) => handleNotificationClick(type, data)}
          />

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
          ) : selectedTable === "carsUnderService" ? (  // 🚀 הוספה כאן
            <CarsUnderService  onClose={() => setSelectedTable(null)} />
          ) : (
              <DashboardTables
                tableTitle={tableTitle}
                tableData={tableData}
                tableHeaders={selectedTable === "dynamic" ? dynamicTableHeaders : tableHeaders[selectedTable]}
                onClose={() => setSelectedTable(null)}
              />
            )}



        </main>
        <MessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSend={() => alert("📤 הודעה נשלחה!")}
          sendToAll={sendToAll}
          setSendToAll={setSendToAll}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          message={message}
          setMessage={setMessage}
        />
      </div>
    );
  };


  export default AdvancedDashboard;
