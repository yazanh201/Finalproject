import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, LabelList, Cell
} from 'recharts';
import styles from './Charts.module.css';
import axios from 'axios';

// 🎨 צבעים שונים לכל סוג טיפול
const COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#8dd1e1', '#a28bd4', '#f4a261'];

const RevenueByRepairTypeChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios.get("http://localhost:5000/api/treatments/summary/revenue-by-category")
    .then(res => {
      if (!Array.isArray(res.data)) {
        console.error("❌ הצורה של הנתונים אינה מערך:", res.data);
        setData([]); // בטיחות
        return;
      }

      const filtered = res.data.filter(item => item.value > 0);
      const transformed = filtered.map(item => ({
        name: item.name,
        revenue: item.value
      }));
      setData(transformed);
    })
    .catch(err => {
      console.error("❌ שגיאה בשליפת הכנסות:", err);
      setData([]);
    })
    .finally(() => setLoading(false));
}, []);


  return (
    <div className={styles.chartContainer} dir="rtl">
      <h3 className={styles.chartTitle}>הכנסות לפי סוג טיפול</h3>

      {loading ? (
        <p style={{ textAlign: 'center' }}>טוען נתונים...</p>
      ) : data.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>אין נתונים להצגה</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                `₪${Number(value).toLocaleString('he-IL')}`
              }
            />
            <Bar dataKey="revenue">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(value) =>
                  `₪${Number(value).toLocaleString('he-IL')}`
                }
                style={{ fill: '#000', fontWeight: 'bold', fontSize: 13 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueByRepairTypeChart;