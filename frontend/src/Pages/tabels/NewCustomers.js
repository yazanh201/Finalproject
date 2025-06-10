import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables"; // ודא שזה הנתיב הנכון
import styles from "../cssfiles/Advanceddashboard.module.css";

const NewCustomers = ({ onClose }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchNewCustomers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customers/new-this-month");
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("❌ שגיאה בשליפת לקוחות חדשים:", error);
      }
    };

    fetchNewCustomers();
  }, []);

  // הכנת headers תואמים בדיוק לכותרות שלך
  const tableHeaders = ["שם", "טלפון", "ת\"ז", "מספר רכב"];

  // יצירת tableData בפורמט מתאים בדיוק כמו שהטבלה דורשת
  const tableData = customers.map(c => ({
    "שם": c.name,
    "טלפון": c.phone,
    "ת\"ז": c.idNumber,
     "מספר רכב": c.vehicles[0] || "—"
  }));


  return (
    <DashboardTables
      tableTitle="👥 לקוחות חדשים החודש"
      tableHeaders={tableHeaders}
      tableData={tableData}
      onClose={onClose}
    />
  );
};

export default NewCustomers;
