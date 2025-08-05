import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../cssfiles/Advanceddashboard.module.css"; // קובץ עיצוב מותאם לדשבורד

// קומפוננטה להצגת כל התורים של החודש הנוכחי
const MonthlyAppointments = ({ onClose }) => {
  const [appointments, setAppointments] = useState([]); // שמירת רשימת התורים

  // טעינת התורים עם הרצת הקומפוננטה
  useEffect(() => {
    const fetchMonthlyAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/appointments/month"); // בקשת GET מהשרת
        console.log("📦 תורים שהגיעו מהשרת:", response.data); // הדפסת הנתונים לבדיקה
        setAppointments(response.data); // שמירת הנתונים בסטייט
      } catch (error) {
        console.error("❌ שגיאה בשליפת תורים חודשיים:", error);
      }
    };

    fetchMonthlyAppointments(); // קריאה לפונקציה עם טעינת הרכיב
  }, []); // ריצה חד-פעמית בעת טעינה

  return (
    <div className={styles.tableSection}>
      <h3>📋 סה״כ תורים לחודש</h3>

      {/* כפתור סגירת הטבלה */}
      <button className={styles.closeTable} onClick={onClose}>
        ❌ סגור
      </button>

      {/* טבלת תצוגת התורים */}
      <table>
        <thead>
          <tr>
            <th>מזהה תור</th>
            <th>שם</th>
            <th>ת"ז</th>
            <th>מספר רכב</th>
            <th>טלפון</th> {/* ✅ שדה חדש להצגת טלפון */}
            <th>תאריך</th>
            <th>שעה</th>
            <th>תיאור</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a, idx) => (
            <tr key={idx}>
              <td>{a.appointmentNumber}</td> {/* מזהה ייחודי לתור */}
              <td>{a.name}</td> {/* שם הלקוח */}
              <td>{a.idNumber}</td> {/* ת"ז */}
              <td>{a.carNumber}</td> {/* מספר רכב */}
              <td>{a.phoneNumber || "—"}</td> {/* טלפון, ואם לא קיים – תצוגת מקף */}
              <td>{a.date?.slice(0, 10)}</td> {/* תאריך (פורמט yyyy-mm-dd) */}
              <td>{a.time}</td> {/* שעת התור */}
              <td>{a.description}</td> {/* תיאור התור */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyAppointments;
