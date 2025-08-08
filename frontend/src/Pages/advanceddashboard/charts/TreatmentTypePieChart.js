import React, { useEffect, useState } from 'react'; // React ו־Hooks
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // קומפוננטות גרף עוגה
import styles from './Charts.module.css'; // עיצוב CSS
import axios from 'axios'; // ספרייה לשליחת בקשות HTTP

// 🎨 מערך צבעים שישמש לצביעת פרוסות העוגה
const COLORS = ['#8884d8', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042', '#a28bd4', '#f4a261'];

// ✅ פונקציה ליצירת תוויות מותאמות אישית על פרוסות העוגה (רק אם האחוז גדול מ־0)
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent <= 0) return null; // לא להציג תווית אם האחוז הוא 0

  const RADIAN = Math.PI / 180; // המרה לרדיאנים
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7; // חישוב מיקום התווית
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={13}
      fontWeight="bold"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const TreatmentTypePieChart = () => {
  const [data, setData] = useState([]); // שמירת נתוני הטיפולים
  const [loading, setLoading] = useState(true); // סטטוס טעינה

  // 🧠 שליפת נתונים מהשרת ברגע טעינת הקומפוננטה
  useEffect(() => {
    axios.get("https://garage-backend-o8do.onrender.com/api/treatments/summary/revenue-by-category")
      .then(res => {
        if (!Array.isArray(res.data)) {
          console.error("❌ הצורה של הנתונים אינה מערך:", res.data);
          setData([]); // בטיחות במקרה של תגובה לא תקינה
          return;
        }

        // ✅ סינון רק רשומות עם ערך גבוה מ־0
        const filteredData = res.data.filter(entry => entry.value > 0);
        setData(filteredData);
      })
      .catch(err => {
        console.error("שגיאה בשליפת נתוני גרף:", err); // טיפול בשגיאה
        setData([]);
      })
      .finally(() => {
        setLoading(false); // סיום טעינה בכל מקרה
      });
  }, []);

  return (
    <div className={styles.chartContainer}> {/* עיצוב חיצוני לגרף */}
      <h3 className={styles.chartTitle}>התפלגות סוגי טיפולים</h3> {/* כותרת הגרף */}

      {/* טיפול במצבים – טוען / אין נתונים / תצוגת גרף */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>טוען נתונים...</p> // בזמן טעינה
      ) : data.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>אין נתונים להצגה</p> // אם אין נתונים
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data} // הנתונים
              cx="50%" // מיקום אופקי
              cy="50%" // מיקום אנכי
              labelLine={false} // לא להציג קווים לתוויות
              outerRadius={120} // גודל חיצוני של העוגה
              dataKey="value" // מהו ערך החישוב
              label={renderCustomizedLabel} // שימוש בתוויות מותאמות אישית
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // צבע לכל פרוסה
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} ₪`, 'הכנסה']} /> {/* תצוגת tooltip */}
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              iconSize={12}
              wrapperStyle={{ fontSize: '14px', marginTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TreatmentTypePieChart; // ייצוא הקומפוננטה
