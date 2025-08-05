import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables";

// קומפוננטה להצגת הכנסות חודשיות על בסיס טיפולים שבוצעו בחודש הנוכחי
const MonthlyRevenueTable = ({ onClose }) => {
  const [treatments, setTreatments] = useState([]); // סטייט לשמירת רשימת הטיפולים

  useEffect(() => {
    // פונקציה לשליפת טיפולים מה-API וסינון לפי חודש נוכחי
    const fetchMonthlyTreatments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/treatments"); // קריאה ל-API
        const data = await res.json(); // המרת התגובה ל-JSON

        const now = new Date(); // תאריך נוכחי
        const currentMonth = now.getMonth(); // החודש הנוכחי (0-11)
        const currentYear = now.getFullYear(); // השנה הנוכחית

        // סינון הטיפולים לפי תאריך החודש והשנה הנוכחיים
        const filtered = data.filter((t) => {
          const d = new Date(t.date); // תאריך מהשדה `date` של הטיפול
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        // עיצוב מחדש של הנתונים לתצוגת טבלה
        const tableFormatted = filtered.map((t) => ({
          "מזהה טיפול": t.treatmentNumber || "—",
          "תאריך": t.date?.slice(0, 10) || "—", // חיתוך ל-YYYY-MM-DD
          "עלות (₪)": t.cost ? `${t.cost.toLocaleString()} ₪` : "—",
          "מספר רכב": t.carPlate || "—",
          "שם לקוח": t.customerName || "—",
          "סטטוס": t.status || "—"
        }));

        setTreatments(tableFormatted); // עדכון הסטייט
      } catch (err) {
        console.error("❌ שגיאה בטיפולים החודשיים:", err);
      }
    };

    fetchMonthlyTreatments(); // הפעלת הפונקציה עם טעינת הקומפוננטה
  }, []); // [] → אפקט רץ רק פעם אחת

  return (
    <DashboardTables
      tableTitle="💰 טיפולים שבוצעו החודש" // כותרת לטבלה
      tableData={treatments} // נתונים לתצוגה בטבלה
      tableHeaders={treatments.length > 0 ? Object.keys(treatments[0]) : []} // הפקת כותרות לפי השדות של הטיפול
      onClose={onClose} // פעולה לסגירת הטבלה
    />
  );
};

export default MonthlyRevenueTable;
