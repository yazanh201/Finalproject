import React, { useEffect, useState } from "react";
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

  return (
    <div className={styles.tableSection}>
      <h3>👥 לקוחות חדשים החודש</h3>
      <button className={styles.closeTable} onClick={onClose}>❌ סגור</button>
      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>ת"ז</th>
            <th>תאריך הרשמה</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr key={idx}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.idNumber}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewCustomers;
