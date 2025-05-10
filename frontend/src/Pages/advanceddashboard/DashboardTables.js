import React from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";

const DashboardTables = ({ selectedTable, tableTitle, tableData, tableHeaders, onClose, onConfirmArrival }) => {
  if (!selectedTable) return null;

  return (
    <section className={styles.tableSection}>
      <h3>📋 {tableTitle}</h3>
      <button className={styles.closeTable} onClick={onClose}>❌ סגור</button>

      <table>
        <thead>
          <tr>
            {(tableHeaders[selectedTable] || []).map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {(tableHeaders[selectedTable] || []).map((headerKey, i) => {
                if (selectedTable === "todayAppointments" && headerKey === "פעולה") return null;

                const entryKey = Object.keys(row).find(
                  k => k === headerKey || k.toLowerCase() === headerKey.toLowerCase()
                );
                return <td key={i}>{row[entryKey]}</td>;
              })}

              {selectedTable === "todayAppointments" && (
                <td>
                  <button
                    className={styles.sendBtn}
                    onClick={() =>
                      onConfirmArrival(`${row["מזהה תור"]}-${row._id}-${row.treatmentId}`)
                    }
                  >
                    ✅ הגיע
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default DashboardTables;
