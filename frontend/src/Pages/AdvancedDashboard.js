import React, { useState, useEffect } from "react";
import styles from "./Advanceddashboard.module.css";
import { useNavigate } from "react-router-dom";

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

    useEffect(() => {
        setStats([
            { title: "סה״כ תורים לחודש", value: 25, key: "appointments" },
            { title: "רכבים בטיפול", value: 12, key: "carsUnderMaintenance" },
            { title: "לקוחות חדשים", value: 8, key: "newCustomers" },
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
            { vehicle: "יונדאי i20", reason: "מחכים לחלפים", delay: "3 ימים", carNumber: "123-45-678" },
            { vehicle: "טויוטה קורולה", reason: "חוסר כוח אדם", delay: "יום אחד", carNumber: "987-65-432" },
        ]);
    }, []);

    const showTable = (key) => {
        let data = [];
        let title = "";
        switch (key) {
            case "newCustomers":
                data = [
                    { name: "ישראל כהן", phone: "050-1234567", joined: "15/03/2025" },
                    { name: "מיכל לוי", phone: "052-9876543", joined: "18/03/2025" },
                ];
                title = "לקוחות חדשים";
                break;
            case "carsUnderMaintenance":
                data = delayedTreatments;
                title = "רכבים בטיפול";
                break;
            case "appointments":
                data = [
                    { customer: "ישראל כהן", date: "20/03/2025", service: "בדיקה תקופתית" },
                    { customer: "דני לוי", date: "21/03/2025", service: "החלפת בלמים" },
                ];
                title = "תורים";
                break;
            case "delayedTreatments":
                data = delayedTreatments;
                title = "טיפולים שהתעכבו";
                break;
            default:
                data = [];
        }

        setSelectedTable(key);
        setTableData(data);
        setTableTitle(title);
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <h2 className={styles.headerh2}> לוח ניהול מתקדם </h2>
                <button className={styles.backBtn} onClick={goToDashboard}>⬅️ חזור לדשבורד</button>
            </header>

            {/* 🔹 Sidebar */}
            <aside className={styles.sidebar}>
                <button className={styles.sendMessageBtn} onClick={() => setIsModalOpen(true)}>📩 שליחת הודעות</button>
            </aside>

            <main className={styles.mainContent}>
                <section className={styles.notificationsSection}>
                    <h3>🔔 התראות אחרונות</h3>
                    <ul>
                        {notifications.map((note, idx) => (
                            <li key={idx} onClick={() => showTable(note.type)}>
                                {note.message}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.statsSection}>
                    {stats.map((stat, idx) => (
                        <div className={styles.statCard} key={idx} onClick={() => showTable(stat.key)}>
                            <h3>{stat.title}</h3>
                            <p>{stat.value.toLocaleString()}</p>
                        </div>
                    ))}
                </section>

                {selectedTable && (
                    <section className={styles.tableSection}>
                        <h3>📋 {tableTitle}</h3>
                        <button className={styles.closeTable} onClick={() => setSelectedTable(null)}>❌ סגור</button>
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(tableData[0] || {}).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, idx) => (
                                    <tr key={idx}>
                                        {Object.values(row).map((val, i) => (
                                            <td key={i}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>📩 שליחת הודעה</h3>
                        <label>
                            <input type="checkbox" checked={sendToAll} onChange={() => setSendToAll(!sendToAll)} />
                            שלח לכל הלקוחות
                        </label>
                        {!sendToAll && (
                            <input type="text" placeholder="מספר טלפון" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        )}
                        <textarea placeholder="הקלד את ההודעה כאן..." value={message} onChange={(e) => setMessage(e.target.value)} />
                        <div className={styles.modalButtons}>
                            <button className={styles.sendBtn}>📤 שלח</button>
                            <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>❌ סגור</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedDashboard;
