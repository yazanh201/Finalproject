import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css';

const data = [
  { name: 'שירות', value: 8000 },
  { name: 'בלמים', value: 4000 },
  { name: 'חידוש תקלות', value: 6000 },
  { name: 'מנוע', value: 10000 },
  { name: 'חשמל', value: 3000 }
];
const COLORS = ['#8884d8', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042'];

// פונקציה מותאמת אישית להצגת אחוזים באופן קריא
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
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
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>התפלגות סוגי טיפולים</h3>
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
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
    </div>
  );
};

export default TreatmentTypePieChart;
