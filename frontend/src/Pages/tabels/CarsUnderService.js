import React, { useEffect, useState } from "react";
// ✅ ייבוא קומפוננטה להצגת טבלה בדשבורד
import DashboardTables from "../advanceddashboard/DashboardTables";

// ✅ קומפוננטה להצגת רכבים שנמצאים כרגע בטיפול (status שונה מ"הסתיים")
const CarsUnderService = ({ onClose }) => {
  // ⬅️ סטייט לשמירת טיפולים שעדיין לא הסתיימו
  const [treatments, setTreatments] = useState([]);

  // ⏳ בעת טעינת הקומפוננטה, שליפת טיפולים מהשרת
  useEffect(() => {
    fetch("https://garage-backend-o8do.onrender.com/api/treatments") // קריאה ל-API
      .then(res => res.json())                    // המרת תשובה ל-JSON
      .then(data => {
        // 🛠️ במידה והשרת מחזיר אובייקט יחיד ולא מערך – נהפוך למערך
        const result = Array.isArray(data) ? data : [data];

        // ✅ סינון טיפולים שהסטטוס שלהם שונה מ"הסתיים" (כלומר עדיין בטיפול)
        const underService = result.filter(t => t.status !== "הסתיים");

        setTreatments(underService); // עדכון הסטייט
      })
      .catch(err => console.error("❌ שגיאה בשליפת רכבים בטיפול:", err)); // טיפול בשגיאה
  }, []);

  // ✅ כותרות העמודות של הטבלה
  const tableHeaders = ["מזהה טיפול", "רכב", "לקוח", "סטטוס", "תיאור", "תאריך"];

  // ✅ מיפוי הטיפולים למבנה הנתונים לטבלה
  const tableData = treatments.map(t => ({
    "מזהה טיפול": t.treatmentNumber,
    "רכב": t.carPlate,
    "לקוח": t.customerName,
    "סטטוס": t.status,
    "תיאור": t.description || "—", // אם אין תיאור – הצג מקף
    "תאריך": new Date(t.updatedAt).toLocaleDateString() // תאריך עדכון מעוצב
  }));

  // ✅ הצגת טבלת הטיפולים בדשבורד עם כפתור סגירה
  return (
    <DashboardTables
      tableTitle="🚗 רכבים בטיפול"     // כותרת הטבלה
      tableHeaders={tableHeaders}       // כותרות העמודות
      tableData={tableData}             // הנתונים להצגה
      onClose={onClose}                 // פעולה לסגירת הטבלה
    />
  );
};

export default CarsUnderService;
