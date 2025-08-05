import React, { useEffect, useState } from 'react'; // שימוש ב־React ו־Hooks
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, LabelList, Cell
} from 'recharts'; // רכיבי גרפים של Recharts
import styles from './Charts.module.css'; // עיצוב לגרף
import axios from 'axios'; // ספרייה לשליחת בקשות HTTP

// 🎨 מערך צבעים שמשמש לצביעת כל עמודה בגרף בצבע שונה
const COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#8dd1e1', '#a28bd4', '#f4a261'];

const RevenueByRepairTypeChart = () => {
  const [data, setData] = useState([]); // אחסון הנתונים לגרף
  const [loading, setLoading] = useState(true); // סטטוס טעינת נתונים

  // טעינת הנתונים מהשרת בעת טעינת הרכיב
  useEffect(() => {
    axios.get("http://localhost:5000/api/treatments/summary/revenue-by-category")
      .then(res => {
        // בדיקה שהנתונים שהוחזרו הם מערך
        if (!Array.isArray(res.data)) {
          console.error("❌ הצורה של הנתונים אינה מערך:", res.data);
          setData([]); // ריק במקרה של בעיה
          return;
        }

        // סינון פריטים שערך ההכנסה שלהם הוא מעל 0
        const filtered = res.data.filter(item => item.value > 0);

        // שינוי שם השדות ל־name ו־revenue כדי להתאים לגרף
        const transformed = filtered.map(item => ({
          name: item.name,
          revenue: item.value
        }));

        setData(transformed); // שמירת הנתונים ב־state
      })
      .catch(err => {
        // טיפול בשגיאה אם נכשל הבקשה
        console.error("❌ שגיאה בשליפת הכנסות:", err);
        setData([]);
      })
      .finally(() => setLoading(false)); // סיום טעינה
  }, []);

  return (
    <div className={styles.chartContainer} dir="rtl"> {/* קונטיינר לגרף, יישור לימין */}
      <h3 className={styles.chartTitle}>הכנסות לפי סוג טיפול</h3> {/* כותרת הגרף */}

      {/* הצגת סטטוס בהתאם למצב הטעינה */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>טוען נתונים...</p> // בזמן טעינה
      ) : data.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>אין נתונים להצגה</p> // אם אין נתונים
      ) : (
        // גרף עמודות בתוך קונטיינר רספונסיבי
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" /> {/* ציר X – מציג את שם סוג הטיפול */}
            <YAxis /> {/* ציר Y – ערכי ההכנסה */}
            <Tooltip
              formatter={(value) =>
                `₪${Number(value).toLocaleString('he-IL')}` // תצוגת ערך עברי עם שקל
              }
            />
            <Bar dataKey="revenue"> {/* עמודות עם ערך ההכנסה */}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]} // צבע עמודה שונה לכל סוג טיפול
                />
              ))}
              {/* הצגת תגית עם הערך בראש כל עמודה */}
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(value) =>
                  `₪${Number(value).toLocaleString('he-IL')}` // תצוגת ערך עם שקל
                }
                style={{ fill: '#000', fontWeight: 'bold', fontSize: 13 }} // עיצוב תגית
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueByRepairTypeChart; // ייצוא הקומפוננטה
