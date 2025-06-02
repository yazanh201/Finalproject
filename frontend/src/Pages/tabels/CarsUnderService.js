import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables";

const CarsUnderService = ({ onClose }) => {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/treatments")
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : [data];
        const underService = result.filter(t => t.status !== "הסתיים");
        setTreatments(underService);
      })
      .catch(err => console.error("❌ שגיאה בשליפת רכבים בטיפול:", err));
  }, []);

  const tableHeaders = ["מזהה טיפול", "רכב", "לקוח", "סטטוס", "תיאור", "תאריך"];
  const tableData = treatments.map(t => ({
    "מזהה טיפול": t.treatmentNumber,
    "רכב": t.carPlate,
    "לקוח": t.customerName,
    "סטטוס": t.status,
    "תיאור": t.description || "—",
    "תאריך": new Date(t.updatedAt).toLocaleDateString()
  }));

  return (
    <DashboardTables
      tableTitle="🚗 רכבים בטיפול"
      tableHeaders={tableHeaders}
      tableData={tableData}
      onClose={onClose}
    />
  );
};

export default CarsUnderService;
