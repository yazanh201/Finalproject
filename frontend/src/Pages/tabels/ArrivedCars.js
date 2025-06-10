import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables"; // ודא שזה הנתיב הנכון

const ArrivedCars = ({ onClose }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchArrivedCars();
  }, []);

  const fetchArrivedCars = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments");
      const data = await res.json();
      const today = new Date().toISOString().slice(0, 10);
      const arrived = data.filter(a => a.date === today && a.arrivalStatus === "הגיע");
      setAppointments(arrived);
    } catch (error) {
      console.error("❌ שגיאה בשליפת תורים:", error);
    }
  };

  const tableHeaders = [ "שם לקוח", "ת\"ז", "מספר רכב", "שעה", "תיאור", "תאריך"];

  const tableData = appointments.map(a => ({
    "שם לקוח": a.name,
    "ת\"ז": a.idNumber,
    "מספר רכב": a.carNumber,
    "שעה": a.time || "",
    "תיאור": a.description || "",
    "תאריך": a.date
  }));

  return (
    <DashboardTables
      tableTitle=" רכבים שהגיעו לטיפול היום"
      tableHeaders={tableHeaders}
      tableData={tableData}
      onClose={onClose}
    />
  );
};

export default ArrivedCars;
