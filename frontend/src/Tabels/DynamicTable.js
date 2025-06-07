import React from "react";
import styles from "./DynamicTable.module.css";

const DynamicTable = ({ title, headers, data, onClose, actionLabel, onRowAction }) => {
  return (
    <div className={styles.tableSection}>
      {title && <h3>{title}</h3>}

      {onClose && (
        <button className={styles.closeTable} onClick={onClose}>
          ❌ סגור
        </button>
      )}

      <div className={styles.scrollContainer}>
        <table className="table table-striped">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header.label}</th>
              ))}
              {onRowAction && <th>פעולה</th>}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i}>
                  {headers.map((header, j) => (
                    <td key={j}>{row[header.key] ?? "—"}</td>
                  ))}
                  {onRowAction && (
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onRowAction(row)}
                      >
                        {actionLabel || "בחר"}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + (onRowAction ? 1 : 0)}>אין נתונים</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
