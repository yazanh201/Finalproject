import React from "react";
import useRecommendedCars from "../../hooks/useRecommendedCars"; // ✔️ Hook לשליפת רכבים שמומלץ לבדוק
import DashboardTables from "../advanceddashboard/DashboardTables"; // ✔️ קומפוננטת טבלה

// 🔧 קומפוננטה להצגת רשימת רכבים שמומלץ לבצע להם בדיקה (לפי חישוב קילומטראז' או זמן)
const RecommendedCars = ({ onClose }) => {
  // שימוש ב-Hook מותאם אישית לשליפת הנתונים
  const recommendedCars = useRecommendedCars();

  // 🧾 הגדרת כותרות העמודות שיוצגו בטבלה
  const tableHeaders = [
    "מספר רכב",              // מספר רישוי
    "שם בעלים",              // שם הלקוח
    "טלפון בעלים",           // ✅ טלפון הלקוח (התווסף לאחרונה)
    "שנת ייצור",             // שנת ייצור הרכב
    "קילומטראז' אחרון",      // מה נרשם לאחרונה
    "קילומטראז' מחושב",      // לפי חישוב זמן ומרחק
    "חודשים מאז טיפול",       // כמה זמן עבר מהטיפול האחרון
    "תאריך טיפול אחרון"       // תאריך עדכון אחרון
  ];

  // ✅ החזרת קומפוננטת הטבלה עם כל הנתונים שהוגדרו
  return (
    <DashboardTables
      tableTitle="🚗 רכבים מומלצים לבדיקה" // כותרת הטבלה שתוצג
      tableHeaders={tableHeaders}           // כותרות העמודות
      tableData={recommendedCars}           // הנתונים שמתקבלים מה־hook
      onClose={onClose}                     // פונקציית סגירה חיצונית
    />
  );
};

export default RecommendedCars;
