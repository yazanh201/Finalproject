import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // הסרת סטטוס החיבור
    navigate('/login'); // חזרה לדף ההתחברות
  };

  return (
    <div className="dashboard-container">
      <h1>ברוך הבא ללוח הבקרה</h1>
      <button onClick={handleLogout}>התנתק</button>
    </div>
  );
};

export default Dashboard;
