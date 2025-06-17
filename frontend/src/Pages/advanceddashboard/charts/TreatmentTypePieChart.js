import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css';
import axios from 'axios';

const COLORS = ['#8884d8', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042', '#a28bd4', '#f4a261'];

// ✅ תוויות על העוגה – רק אם אחוז > 0
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent <= 0) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={13} fontWeight="bold">
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const TreatmentTypePieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/treatments/summary/revenue-by-category')
      .then(res => {
        const filteredData = res.data.filter(entry => entry.value > 0); // ✅ סינון ערכים של 0
        setData(filteredData);
      })
      .catch(err => {
        console.error("שגיאה בשליפת נתוני גרף:", err);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>התפלגות סוגי טיפולים</h3>

      {loading ? (
        <p style={{ textAlign: 'center' }}>טוען נתונים...</p>
      ) : data.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>אין נתונים להצגה</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} ₪`, 'הכנסה']} />
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

export default TreatmentTypePieChart;
