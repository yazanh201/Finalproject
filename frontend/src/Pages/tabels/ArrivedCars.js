import React, { useEffect, useState } from "react";
// ✅ ייבוא קומפוננטה להצגת טבלאות דינאמיות בלוח הניהול
import DashboardTables from "../advanceddashboard/DashboardTables"; // ודא שזה הנתיב הנכון

// ✅ קומפוננטה להצגת תורים של רכבים שהגיעו לטיפול היום
const ArrivedCars = ({ onClose }) => {
  // ⬅️ סטייט לשמירת רשימת התורים שהרכבים שלהם הגיעו בפועל
  const [appointments, setAppointments] = useState([]);

  // ⏳ קריאה לפונקציית שליפת תורים בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchArrivedCars();
  }, []);

  // 🔄 שליפת תורים מהשרת וסינון לפי תאריך היום וסטטוס הגעה
  const fetchArrivedCars = async () => {
    try {
      const res = await fetch("https://garage-backend-o8do.onrender.com/api/appointments"); // קריאה לשרת
      const data = await res.json(); // המרת תשובה ל-JSON

      const today = new Date().toISOString().slice(0, 10); // תאריך היום בפורמט YYYY-MM-DD

      // ✅ סינון רק תורים של היום שהסטטוס שלהם הוא "הגיע"
      const arrived = data.filter(a => a.date === today && a.arrivalStatus === "הגיע");

      setAppointments(arrived); // עדכון הסטייט
    } catch (error) {
      console.error("❌ שגיאה בשליפת תורים:", error); // טיפול בשגיאה
    }
  };

  // ✅ כותרות הטבלה להצגה
  const tableHeaders = ["שם לקוח", "ת\"ז", "מספר רכב", "שעה", "תיאור", "תאריך"];

  // ✅ מיפוי הנתונים מהשרת למבנה הטבלה (מילון של שדות בעברית)
  const tableData = appointments.map(a => ({
    "שם לקוח": a.name,
    "ת\"ז": a.idNumber,
    "מספר רכב": a.carNumber,
    "שעה": a.time || "",            // אם אין שעה – השאר ריק
    "תיאור": a.description || "",    // אם אין תיאור – השאר ריק
    "תאריך": a.date
  }));

  // ✅ הצגת טבלת DashboardTables עם הנתונים והכפתור לסגירה
  return (
    <DashboardTables
      tableTitle=" רכבים שהגיעו לטיפול היום"  // כותרת הטבלה
      tableHeaders={tableHeaders}              // כותרות העמודות
      tableData={tableData}                    // הנתונים עצמם
      onClose={onClose}                        // פונקציית סגירה חיצונית
    />
  );
};

export default ArrivedCars;
