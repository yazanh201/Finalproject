import React from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";

const DashboardTables = ({ tableTitle, tableData, tableHeaders, onClose }) => {
  if (!tableData || tableData.length === 0) return null;

  return (
    <section className={styles.tableSection}>
      <h3> {tableTitle}</h3>
      <button className={styles.closeTable} onClick={onClose}>❌ סגור</button>

      <table>
        <thead>
          <tr>
            {tableHeaders.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {tableHeaders.map((headerKey, i) => {
                const entryKey = Object.keys(row).find(
                  k => k === headerKey || k.toLowerCase() === headerKey.toLowerCase()
                );
                return <td key={i}>{row[entryKey] ?? "—"}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default DashboardTables;
