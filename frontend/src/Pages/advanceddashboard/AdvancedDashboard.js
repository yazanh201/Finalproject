import React, { useState, useEffect } from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // ייבוא האייקון
import DashboardOverview from "./DashboardOverview";
import DashboardTables from "./DashboardTables";
import MessageModal from "./MessageModal";
import MonthlyAppointments from "../tabels/MonthlyAppointments";
import NewCustomers from "../tabels/NewCustomers";


const AdvancedDashboard = () => {
    const navigate = useNavigate();
  
    const goToDashboard = () => {
      navigate("/dashboard");
    };

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
        const fetchNewCustomers = async () => {
            try {
            const res = await fetch("http://localhost:5000/api/customers/new-this-month");
            const data = await res.json();
            setNewCustomersCount(data.length); // ✅ שמירת כמות לקוחות חדשים
            } catch (error) {
            console.error("❌ שגיאה בשליפת לקוחות חדשים:", error);
            }
        };

        fetchNewCustomers();
        }, []);

    useEffect(() => {
        const fetchMonthlyAppointments = async () => {
            try {
            const response = await fetch("http://localhost:5000/api/appointments/month");
            const data = await response.json();
            setMonthlyAppointmentCount(data.length); // ✅ מעדכן רק פעם אחת
            } catch (error) {
            console.error("❌ שגיאה בשליפת תורים חודשיים:", error);
            }
        };

        fetchMonthlyAppointments();
        }, []); // ✅ רק בעת עלייה


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
    {
      car: "יונדאי i20",
      reason: "מחכים לחלפים",
      delay: "3 ימים",
      plate: "123-45-678"
    },
    {
      car: "טויוטה קורולה",
      reason: "חוסר כוח אדם",
      delay: "יום אחד",
      plate: "987-65-432"
    },
  ]);
}, [monthlyAppointmentCount,newCustomersCount]); // ✅ כך תופעל גם לפי העדכון מהשרת


    // 🔹 חישוב רכבים מומלצים לטיפול
    useEffect(() => {
        const today = new Date();

        const cars = [
            { id: 1, owner: "ישראל כהן", plateNumber: "123-45-678", lastServiceDate: "2025-08-10", lastKm: 20000, avgMonthlyKm: 2000 },
            { id: 2, owner: "דני לוי", plateNumber: "987-65-432", lastServiceDate: "2023-06-15", lastKm: 45000, avgMonthlyKm: 1800 },
            { id: 3, owner: "מיכל לוי", plateNumber: "789-12-345", lastServiceDate: "2023-10-01", lastKm: 30000, avgMonthlyKm: 2200 },
        ];

        const filteredCars = cars.map((car) => {
            const lastServiceDate = new Date(car.lastServiceDate);

            const monthsSinceService =
                (today.getFullYear() - lastServiceDate.getFullYear()) * 12 +
                (today.getMonth() - lastServiceDate.getMonth());

            const estimatedKm = car.lastKm + monthsSinceService * car.avgMonthlyKm;

            const needsService = monthsSinceService >= 6 || estimatedKm - car.lastKm >= 15000;

            return needsService ? {
                "מספר רכב": car.plateNumber,
                "בעלים": car.owner,
                "קילומטרים משוערים": estimatedKm.toLocaleString(),
                "חודשים מהטיפול האחרון": monthsSinceService
            } : null;
        }).filter(car => car !== null);

        setRecommendedCars(filteredCars);
    }, []);

    const showTable = (key) => {
    let data = [];
    let title = "";

    switch (key) {
        case "recommendedCars":
            data = recommendedCars;
            title = "רכבים מומלצים לבדיקה";
            setSelectedTable(key);
            break;

        case "newCustomers":
            setSelectedTable("newCustomers");
            return;

        case "todayAppointments":
            fetch("http://localhost:5000/api/appointments")
                .then(res => res.json())
                .then(data => {
                    const today = new Date().toISOString().slice(0, 10);
                    const todaysAppointments = data.filter(a => a.date === today);
                    setTableTitle("תורים להיום");
                    setTableData(todaysAppointments.map(a => ({
                        "מזהה תור": a.appointmentNumber,
                        "שם": a.name,
                        "ת'ז": a.idNumber,
                        "מספר רכב": a.carNumber,
                        "שעה": a.time,
                        "תיאור": a.description,
                        _id: a._id,
                        treatmentId: a.treatment?.treatmentId
                    })));
                    setSelectedTable("todayAppointments");
                });
            return; // ← חשוב: לא להמשיך הלאה

        case "carsUnderMaintenance":
            data = delayedTreatments;
            title = "רכבים בטיפול";
            setSelectedTable(key);
            break;

        case "appointments":
            setSelectedTable("monthlyAppointments");
            return; // ← אין צורך ב-tableData או tableTitle

        case "delayedTreatments":
            data = delayedTreatments;
            title = "טיפולים שהתעכבו";
            setSelectedTable(key);
            break;

        default:
            data = [];
            setSelectedTable(null);
            return;
    }

    setTableData(data);
    setTableTitle(title);
};



    const handleConfirmArrival = async (value) => {
        const [, appointmentId] = value.split("-");
      
        try {
          const res = await fetch("http://localhost:5000/api/treatments/confirm-arrival", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appointmentId })
          });
      
          const data = await res.json();
          if (res.ok) {
            alert("✅ טיפול נוסף!");
            showTable("todayAppointments"); // לרענון הטבלה
          } else {
            alert("❌ שגיאה: " + data.message);
          }
        } catch (error) {
          alert("❌ שגיאה בחיבור לשרת");
        }
      };
      
      
      

      const tableHeaders = {
        todayAppointments: ["מזהה תור", "שם", "ת'ז", "מספר רכב", "שעה", "תיאור", "פעולה"],
        recommendedCars: ["מספר רכב", "בעלים", "קילומטרים משוערים", "חודשים מהטיפול האחרון"],
        newCustomers: ["שם", "טלפון", "תאריך הצטרפות"],
        carsUnderMaintenance: ["רכב", "סיבה", "איחור", "לוחית"],
        delayedTreatments: ["רכב", "סיבה", "איחור", "לוחית"]
      };
      
      

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <h2 className={styles.headerTitle}>לוח ניהול מתקדם</h2>
                <button className={styles.backBtn} onClick={goToDashboard}>
                    <FaArrowLeft className={styles.icon} /> חזור לדשבורד
                </button>
            </header>

            <aside className={styles.sidebar}>
                <button className={styles.sendMessageBtn} onClick={() => setIsModalOpen(true)}>📩 שליחת הודעות</button>
                <button className={styles.sendMessageBtn} onClick={() => showTable("recommendedCars")}>🚗 רכבים מומלצים</button>
                <button className={styles.sendMessageBtn}   >הורדת  דוח חודשי</button>
                <button className={styles.sendMessageBtn} onClick={() => showTable("todayAppointments")}>
                📅 תורים להיום
                </button>


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
                ) : (
                    <DashboardTables
                    selectedTable={selectedTable}
                    tableTitle={tableTitle}
                    tableData={tableData}
                    tableHeaders={tableHeaders}
                    onClose={() => setSelectedTable(null)}
                    onConfirmArrival={handleConfirmArrival}
                    />
                )}
            </main>


            <MessageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSend={() => alert("📤 הודעה נשלחה!")} // אפשר בהמשך לשנות ל־axios post
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



