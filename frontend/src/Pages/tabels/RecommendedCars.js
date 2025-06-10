import React from "react";
import useRecommendedCars from "../../hooks/useRecommendedCars";
import DashboardTables from "../advanceddashboard/DashboardTables";

// קומפוננטה שמציגה טבלה של רכבים שזקוקים לבדיקה/טיפול
const RecommendedCars = ({ onClose }) => {
  const recommendedCars = useRecommendedCars();
  // כותרות הטבלה שיוצגו
  const tableHeaders = [
    "מספר רכב",
    "שם בעלים",
    "טלפון בעלים",        // ✅ הוספה של טלפון
    "שנת ייצור",
    "קילומטראז' אחרון",
    "קילומטראז' מחושב",
    "חודשים מאז טיפול",
    "תאריך טיפול אחרון",
  ];

  return (
    <DashboardTables
      tableTitle="רכבים מומלצים לבדיקה"
      tableHeaders={tableHeaders}
      tableData={recommendedCars}
      onClose={onClose}
    />
  );
};

export default RecommendedCars;
