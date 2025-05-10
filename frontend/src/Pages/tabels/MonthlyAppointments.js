import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../cssfiles/Advanceddashboard.module.css"; // תוכל לשנות לפי המיקום שלך

const MonthlyAppointments = ({ onClose }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchMonthlyAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/appointments");
        const currentDate = new Date();
        const filtered = response.data.filter(app => {
          const appDate = new Date(app.date);
          return (
            appDate.getMonth() === currentDate.getMonth() &&
            appDate.getFullYear() === currentDate.getFullYear()
          );
        });
        setAppointments(filtered);
      } catch (error) {
        console.error("שגיאה בשליפת תורים חודשיים:", error);
      }
    };

    fetchMonthlyAppointments();
  }, []);

  return (
    <div className={styles.tableSection}>
      <h3>📋 סה״כ תורים לחודש</h3>
      <button className={styles.closeTable} onClick={onClose}>
        ❌ סגור
      </button>

      <table>
        <thead>
          <tr>
            <th>מזהה תור</th>
            <th>שם</th>
            <th>ת"ז</th>
            <th>מספר רכב</th>
            <th>תאריך</th>
            <th>שעה</th>
            <th>תיאור</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, idx) => (
            <tr key={idx}>
              <td>{a.appointmentNumber}</td>
              <td>{a.name}</td>
              <td>{a.idNumber}</td>
              <td>{a.carNumber}</td>
              <td>{a.date?.slice(0, 10)}</td>
              <td>{a.time}</td>
              <td>{a.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyAppointments;
