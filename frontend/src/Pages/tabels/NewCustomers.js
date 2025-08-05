import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables"; // ✔️ קומפוננטת טבלה
import styles from "../cssfiles/Advanceddashboard.module.css"; // ✔️ עיצוב

// קומפוננטה להצגת לקוחות חדשים שנוספו במהלך החודש הנוכחי
const NewCustomers = ({ onClose }) => {
  const [customers, setCustomers] = useState([]); // סטייט לשמירת רשימת הלקוחות החדשים

  // אפקט רץ פעם אחת בעת טעינת הקומפוננטה
  useEffect(() => {
    // שליפת נתוני לקוחות חדשים מה-API
    const fetchNewCustomers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customers/new-this-month");
        const data = await res.json();
        setCustomers(data); // שמירת הנתונים בסטייט
      } catch (error) {
        console.error("❌ שגיאה בשליפת לקוחות חדשים:", error);
      }
    };

    fetchNewCustomers(); // קריאה לפונקציה
  }, []); // [] → ריצה חד פעמית

  // הגדרת כותרות הטבלה (בדיוק בשמות שיופיעו)
  const tableHeaders = ["שם", "טלפון", "ת\"ז", "מספר רכב"];

  // המרת הנתונים לפורמט תואם להצגת טבלה
  const tableData = customers.map(c => ({
    "שם": c.name,
    "טלפון": c.phone,
    "ת\"ז": c.idNumber,
    "מספר רכב": c.vehicles?.[0] || "—" // מציג את הרכב הראשון אם קיים, אחרת מקף
  }));

  return (
    <DashboardTables
      tableTitle="👥 לקוחות חדשים החודש" // כותרת שתוצג מעל הטבלה
      tableHeaders={tableHeaders} // כותרות העמודות
      tableData={tableData} // הנתונים המוצגים בטבלה
      onClose={onClose} // פונקציית סגירה
    />
  );
};

export default NewCustomers;
