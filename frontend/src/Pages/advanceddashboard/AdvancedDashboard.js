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

const AdvancedDashboard = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [stats, setStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, appointmentsRes] = await Promise.all([
          fetch("http://localhost:5000/api/customers/new-this-month"),
          fetch("http://localhost:5000/api/appointments/month")
        ]);
        const customersData = await customersRes.json();
        const appointmentsData = await appointmentsRes.json();
        setNewCustomersCount(customersData.length);
        setMonthlyAppointmentCount(appointmentsData.length);
      } catch (error) {
        console.error("❌ Error loading stats:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setStats([
      { title: "סה״כ תורים לחודש", value: monthlyAppointmentCount, key: "appointments" },
      { title: "רכבים בטיפול", value: 12, key: "carsUnderMaintenance" },
      { title: "לקוחות חדשים", value: newCustomersCount, key: "newCustomers" },
      { title: "הכנסות החודש (₪)", value: 12000, key: "income" },
      { title: "טיפולים שהתעכבו", value: 2, key: "delayedTreatments" },
    ]);

    setNotifications([
      { message: "🔧 רכב חדש נכנס לטיפול", type: "carsUnderMaintenance" },
      { message: "📅 לקוח קבע תור חדש למחר", type: "appointments" },
      { message: "💰 התקבל תשלום עבור טיפול", type: "income" },
      { message: "⚠️ עיכוב בטיפול ללקוח מסוים", type: "delayedTreatments" },
    ]);

    setDelayedTreatments([
      { רכב: "יונדאי i20", סיבה: "מחכים לחלפים", איחור: "3 ימים", לוחית: "123-45-678" },
      { רכב: "טויוטה קורולה", סיבה: "חוסר כוח אדם", איחור: "יום אחד", לוחית: "987-65-432" },
    ]);
  }, [monthlyAppointmentCount, newCustomersCount]);

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
      setSelectedTable("todayAppointments"); // שינוי כאן – רק קובע את הטבלה, ללא fetch
      return;
    case "carsUnderMaintenance":
    case "delayedTreatments":
      setTableData(delayedTreatments);
      setTableTitle(key === "carsUnderMaintenance" ? "רכבים בטיפול" : "טיפולים שהתעכבו");
      break;
    case "appointments":
      setSelectedTable("monthlyAppointments");
      return;
    default:
      setTableData([]);
      setSelectedTable(null);
      return;
  }

  setSelectedTable(key);
};

  const tableHeaders = {
    recommendedCars: ["מספר רכב", "בעלים", "קילומטרים משוערים", "חודשים מהטיפול האחרון"],
    newCustomers: ["שם", "טלפון", "תאריך הצטרפות"],
    carsUnderMaintenance: ["רכב", "סיבה", "איחור", "לוחית"],
    delayedTreatments: ["רכב", "סיבה", "איחור", "לוחית"]
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
        <button className={styles.sendMessageBtn} onClick={() => setIsModalOpen(true)}>📩 שליחת הודעות</button>
        <button className={styles.sendMessageBtn} onClick={() => showTable("recommendedCars")}>🚗 רכבים מומלצים</button>
        <button className={styles.sendMessageBtn}>הורדת דוח חודשי</button>
        <button className={styles.sendMessageBtn} onClick={() => showTable("todayAppointments")}>📅 תורים להיום</button>
      </aside>

      <main className={styles.mainContent}>
        <DashboardOverview
          stats={stats}
          notifications={notifications}
          onStatClick={showTable}
          onNotificationClick={showTable}
        />

        {selectedTable === "monthlyAppointments" ? (
          <MonthlyAppointments onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "newCustomers" ? (
          <NewCustomers onClose={() => setSelectedTable(null)} />
        ) : selectedTable === "todayAppointments" ? (
          <TodayAppointments onClose={() => setSelectedTable(null)} />
        ) : (
          <DashboardTables
            selectedTable={selectedTable}
            tableTitle={tableTitle}
            tableData={tableData}
            tableHeaders={tableHeaders}
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
