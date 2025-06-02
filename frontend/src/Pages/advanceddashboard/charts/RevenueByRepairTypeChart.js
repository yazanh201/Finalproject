import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import styles from './Charts.module.css';

const data = [
  { name: 'שירות', revenue: 8000 },
  { name: 'בלמים', revenue: 4000 },
  { name: 'חידוש תקלות', revenue: 6000 },
  { name: 'מנוע', revenue: 10000 },
  { name: 'חשמל', revenue: 3000 }
];

const RevenueByRepairTypeChart = () => {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>הכנסות לפי סוג טיפול</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <XAxis dataKey="name" />
          <YAxis
            orientation="left"
            width={2} // להוסיף רוחב לציר Y כדי שיהיה מקום לכיתוב
          />
          <Tooltip formatter={(value) => `${value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}`} />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8">
            <LabelList
              dataKey="revenue"
              position="top"
              formatter={(value) => `${value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}`}
              style={{ fill: '#333', fontSize: 12, fontWeight: 'bold' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueByRepairTypeChart;
