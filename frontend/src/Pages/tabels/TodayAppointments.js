import React, { useEffect, useState } from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";

const TodayAppointments = ({ onClose }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      const today = new Date().toISOString().slice(0, 10);
      const pendingAppointments = data.filter(a => a.date === today && a.arrivalStatus === "בהמתנה");
      setAppointments(pendingAppointments);
    } catch (error) {
      console.error("❌ שגיאה בשליפת תורים להיום במצב בהמתנה:", error);
    }
  };

  const handleConfirmArrival = async (appointment) => {
    const appointmentId = appointment._id;

    try {
      // עדכון ל"הגיע"
      const res = await fetch(`http://localhost:5000/api/appointments/appointments/${appointmentId}/confirm-arrival`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ שגיאה בעדכון סטטוס: " + data.message);
        return;
      }

      // פתיחת טיפול אוטומטי
      const treatmentRes = await fetch("http://localhost:5000/api/treatments/confirm-arrival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId })
      });

      const treatmentData = await treatmentRes.json();
      if (treatmentRes.ok) {
        alert("✅ טיפול נוסף והסטטוס עודכן להגעה!");
        fetchTodayAppointments();
      } else {
        alert("❌ שגיאה ביצירת טיפול: " + treatmentData.message);
      }
    } catch (error) {
      alert("❌ שגיאה בתהליך: " + error.message);
    }
  };

  const handleRejectArrival = async (appointment) => {
    const appointmentId = appointment._id;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/appointments/${appointmentId}/reject-arrival`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        alert("❌ הסטטוס עודכן ל-'לא הגיע'");
        fetchTodayAppointments();
      } else {
        alert("❌ שגיאה בעדכון סטטוס: " + data.message);
      }
    } catch (error) {
      alert("❌ שגיאה בתהליך: " + error.message);
    }
  };

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
                <button
                  className="btn btn-primary me-3"
                  onClick={() => handleConfirmArrival(a)}
                >
                 הגיע ✅ 
                </button>
                <button
                  className="btn btn-primary me-3"
                  onClick={() => handleRejectArrival(a)}
                >
                 לא הגיע ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAppointments;
