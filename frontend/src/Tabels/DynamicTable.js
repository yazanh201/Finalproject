import React from "react";
import styles from "./DynamicTable.module.css";

// קומפוננטת טבלה דינאמית עם כותרת, כפתור סגירה, כפתור פעולה בשורה ואופציה לגלילה
const DynamicTable = ({ title, headers, data, onClose, actionLabel, onRowAction }) => {
  return (
    <div className={styles.tableSection}>
      {/* כותרת אם קיימת */}
      {title && <h3>{title}</h3>}

      {/* כפתור סגירה אם נשלח onClose */}
      {onClose && (
        <button className={styles.closeTable} onClick={onClose}>
          ❌ סגור
        </button>
      )}

      <div className={styles.scrollContainer}>
        <table className="table table-striped">
          <thead>
            <tr>
              {/* יצירת כותרות הטבלה */}
              {headers.map((header, i) => (
                <th key={i}>{header.label}</th>
              ))}
              {/* עמודת פעולה אם יש onRowAction */}
              {onRowAction && <th>פעולה</th>}
            </tr>
          </thead>
          <tbody>
            {/* אם יש נתונים */}
            {data && data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i}>
                  {/* יצירת תאים לפי מפתחות headers */}
                  {headers.map((header, j) => (
                    <td key={j}>{row[header.key] ?? "—"}</td>
                  ))}
                  {/* כפתור פעולה בכל שורה אם נשלחה פונקציה */}
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
              // במקרה שאין נתונים להצגה
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
