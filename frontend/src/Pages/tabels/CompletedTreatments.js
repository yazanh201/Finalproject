import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables";
import styles from "../cssfiles/Advanceddashboard.module.css";

const CompletedTreatments = ({ onClose }) => {
  const [completedTreatments, setCompletedTreatments] = useState([]);

  useEffect(() => {
    const fetchCompletedTreatments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/treatments");
        const data = await res.json();
        const today = new Date().toISOString().slice(0, 10);
        
        const completedToday = data.filter(t =>
          t.status === "הסתיים" &&
          new Date(t.updatedAt).toISOString().slice(0, 10) === today
        );

        setCompletedTreatments(completedToday);
      } catch (error) {
        console.error("❌ שגיאה בשליפת טיפולים שהסתיימו:", error);
      }
    };

    fetchCompletedTreatments();
  }, []);

  const tableHeaders = ["מזהה טיפול", "רכב", "לקוח", "תיאור", "תאריך עדכון"];
  const tableData = completedTreatments.map(t => ({
    "מזהה טיפול": t.treatmentNumber,
    "רכב": t.carPlate,
    "לקוח": t.customerName,
    "תיאור": t.description,
    "תאריך עדכון": new Date(t.updatedAt).toLocaleDateString()
  }));

  return (
    <DashboardTables
      tableTitle="📅 טיפולים שהסתיימו היום"
      tableHeaders={tableHeaders}
      tableData={tableData}
      onClose={onClose}
    />
  );
};

export default CompletedTreatments;
