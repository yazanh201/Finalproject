import React from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";

// ✅ קומפוננטת DashboardTables
// מציגה טבלה דינמית עם כותרת, נתונים וטיפול באירועים (כמו אישור הגעה לתור)

const DashboardTables = ({ selectedTable, tableTitle, tableData, tableHeaders, onClose, onConfirmArrival }) => {
  // אם אין נתונים בטבלה – לא מציגים כלום
  if (!tableData || tableData.length === 0) return null;

  return (
    <section className={styles.tableSection}>
      {/* כותרת הטבלה */}
      <h3>{tableTitle}</h3>

      {/* כפתור לסגירת הטבלה */}
      <button className={styles.closeTable} onClick={onClose}>❌ סגור</button>

      <table>
        <thead>
          <tr>
            {/* כותרות עמודות */}
            {tableHeaders.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
            {/* הוספת עמודת פעולה אם זו טבלת תורים של היום */}
            {selectedTable === "todayAppointments" && <th>פעולה</th>}
          </tr>
        </thead>

        <tbody>
          {/* שורות הטבלה */}
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {/* יצירת תאים לפי כותרות */}
              {tableHeaders.map((headerKey, i) => {
                // חיפוש מפתח מתאים מתוך האובייקט לפי שם כותרת
                const entryKey = Object.keys(row).find(
                  k => k === headerKey || k.toLowerCase() === headerKey.toLowerCase()
                );
                // הצגת ערך התא, אם אין ערך מציגים קו מפריד
                return <td key={i}>{row[entryKey] ?? "—"}</td>;
              })}

              {/* אם מדובר בטבלת תורים להיום – מוסיפים כפתור "✅ הגיע" */}
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
