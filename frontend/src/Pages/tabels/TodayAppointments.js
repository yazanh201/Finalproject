import React, { useEffect, useState } from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";
import useNotifications from "../advanceddashboard/useNotifications"; // 📢 Hook לשליחת התראות פנימיות

// קומפוננטת הצגת תורים שממתינים להיום
const TodayAppointments = ({ onClose }) => {
  const [appointments, setAppointments] = useState([]); // סטייט לתורים
  const { addNotification } = useNotifications();       // 🔔 פונקציית שליחת התראה

  //  תופעל ברגע טעינת הקומפוננטה
  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  // ✅ שליפת תורים להיום שהסטטוס שלהם "בהמתנה"
  const fetchTodayAppointments = async () => {
    try {
      const response = await fetch("https://garage-backend-o8do.onrender.com/api/appointments");
      const data = await response.json();
      const today = new Date().toISOString().slice(0, 10);
      const pendingAppointments = data.filter(
        a => a.date === today && a.arrivalStatus === "בהמתנה"
      );
      setAppointments(pendingAppointments); // שמירת התורים בסטייט
    } catch (error) {
      console.error("❌ שגיאה בשליפת תורים להיום במצב בהמתנה:", error);
    }
  };

  // 🟩 פעולה בלחיצה על "הגיע" – אישור הגעה + יצירת טיפול חדש
  const handleConfirmArrival = async (appointment) => {
    const appointmentId = appointment._id;
    try {
      // שלב 1: עדכון סטטוס של התור ל"הגיע"
      const res = await fetch(`https://garage-backend-o8do.onrender.com/api/appointments/appointments/${appointmentId}/confirm-arrival`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) {
        alert("❌ שגיאה בעדכון סטטוס: " + data.message);
        return;
      }

      // שלב 2: יצירת טיפול חדש מהתור
      const treatmentRes = await fetch("https://garage-backend-o8do.onrender.com/api/treatments/confirm-arrival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }) // שליחת מזהה התור
      });
      const treatmentData = await treatmentRes.json();

      if (treatmentRes.ok) {
        alert("✅ טיפול נוסף והסטטוס עודכן להגעה!");
        fetchTodayAppointments(); // רענון הטבלה
        addNotification("newTreatment", {
          appointmentId,
          message: "✅ טיפול נוסף נוצר בעקבות אישור הגעה!"
        }); // 🛎️ שליחת התראה
      } else {
        alert("❌ שגיאה ביצירת טיפול: " + treatmentData.message);
      }
    } catch (error) {
      alert("❌ שגיאה בתהליך: " + error.message);
    }
  };

  // 🟥 פעולה בלחיצה על "לא הגיע" – עדכון סטטוס בלבד
  const handleRejectArrival = async (appointment) => {
    const appointmentId = appointment._id;
    try {
      const res = await fetch(`https://garage-backend-o8do.onrender.com/api/appointments/appointments/${appointmentId}/reject-arrival`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (res.ok) {
        alert("❌ הסטטוס עודכן ל-'לא הגיע'");
        fetchTodayAppointments(); // רענון הטבלה
      } else {
        alert("❌ שגיאה בעדכון סטטוס: " + data.message);
      }
    } catch (error) {
      alert("❌ שגיאה בתהליך: " + error.message);
    }
  };

  // 🎯 JSX להצגת טבלת תורים במצב "בהמתנה"
  return (
    <div className={styles.tableSection}>
      <h3>📋 תורים להיום (בהמתנה)</h3>
      <button className="btn btn-primary me-3" onClick={onClose}>❌ סגור</button>

      <table>
        <thead>
          <tr>
            <th>מזהה תור</th>
            <th>שם</th>
            <th>ת"ז</th>
            <th>מספר רכב</th>
            <th>שעה</th>
            <th>תיאור</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, idx) => (
            <tr key={idx}>
              <td>{a.appointmentNumber}</td>
              <td>{a.name}</td>
              <td>{a.idNumber}</td>
              <td>{a.carNumber}</td>
              <td>{a.time}</td>
              <td>{a.description}</td>
              <td>
                <button className="btn btn-primary me-3" onClick={() => handleConfirmArrival(a)}> הגיע ✅ </button>
                <button className="btn btn-primary me-3" onClick={() => handleRejectArrival(a)}> לא הגיע ❌ </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAppointments;
