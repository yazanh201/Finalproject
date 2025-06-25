import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables";

const MonthlyRevenueTable = ({ onClose }) => {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchMonthlyTreatments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/treatments");
        const data = await res.json();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filtered = data.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const tableFormatted = filtered.map((t) => ({
          "מזהה טיפול": t.treatmentNumber || "—",
          "תאריך": t.date?.slice(0, 10) || "—",
          "עלות (₪)": t.cost ? `${t.cost.toLocaleString()} ₪` : "—",
          "מספר רכב": t.carPlate || "—",
          "שם לקוח": t.customerName || "—",
          "סטטוס": t.status || "—"
        }));

        setTreatments(tableFormatted);
      } catch (err) {
        console.error("❌ שגיאה בטיפולים החודשיים:", err);
      }
    };

    fetchMonthlyTreatments();
  }, []);

  return (
    <DashboardTables
      tableTitle="💰 טיפולים שבוצעו החודש"
      tableData={treatments}
      tableHeaders={treatments.length > 0 ? Object.keys(treatments[0]) : []}
      onClose={onClose}
    />
  );
};

export default MonthlyRevenueTable;
