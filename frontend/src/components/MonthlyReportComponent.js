import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import "./cssfiles/MonthlyReport.css";

const MonthlyReportComponent = () => {
  const reportRef = useRef(null);
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]); // ✅ הזמנות
  const [newCustomersList, setNewCustomersList] = useState([]); // ✅ לקוחות חדשים

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // ✅ שליפת טיפולים חודשיים
        const res = await fetch("http://localhost:5000/api/treatments/reports/monthly");
        const result = await res.json();
        setData(result);

        // ✅ שליפת הזמנות חודשיות
        const ordersRes = await fetch("http://localhost:5000/api/carorders/reports/monthly");
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        // ✅ שליפת לקוחות חדשים החודש
        const customersRes = await fetch("http://localhost:5000/api/customers/new-this-month");
        const customersData = await customersRes.json();
        setNewCustomersList(customersData);

      } catch (err) {
        console.error("❌ שגיאה בטעינת דוח:", err);
      }
    };
    fetchReport();
  }, []);

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.5,
      filename: "Monthly_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!data) return <p className="loading">טוען דוח חודשי...</p>;

  return (
    <div className="report-wrapper">
      <div className="report-box" ref={reportRef}>
        
        {/* ✅ כותרת דוח */}
        <div className="businessHeader">
          <div>
            <img src="/img/invlogo.png" alt="לוגו מוסך" className="logo" />
          </div>
          <div>
            <h3>מוסך שירות מהיר</h3>
            <p>רחוב התיקונים 5, חיפה</p>
            <p>טלפון : 03-5551234</p>
            <p>sherotmher12@gmail.com : אימייל </p>
          </div>
        </div>

        <h2 className="reportTitle">דוח חודשי</h2>
        <p className="reportDate">
          {new Date().toLocaleString("he-IL", { month: "long", year: "numeric" })}
        </p>

        {/* ✅ סיכומים */}
        <div className="report-stats">
          <div className="stat-card">סה"כ טיפולים: {data.totalTreatments}</div>
          <div className="stat-card">סה"כ הכנסות: ₪{data.totalRevenue}</div>
          <div className="stat-card">לקוחות חדשים: {newCustomersList.length}</div>
          <div className="stat-card">סה"כ הזמנות: {orders.length}</div>
        </div>

        {/* ✅ טבלת טיפולים */}
        <h3 className="table-title">טיפולים שבוצעו :</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>מספר רכב</th>
              <th>עלות</th>
              <th>תאריך טיפול</th>
            </tr>
          </thead>
          <tbody>
            {data.treatments.map((t, i) => (
              <tr key={i}>
                <td>{t.carPlate}</td>
                <td>{t.cost} ₪</td>
                <td>{new Date(t.date).toLocaleDateString("he-IL")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ טבלת הזמנות רכבים */}
        {orders.length > 0 && (
          <>
            <h3 className="table-title">הזמנות רכבים :</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>מספר רכב</th>
                  <th>פרטי הזמנה</th>
                  <th>עלות</th>
                  <th>תאריך הזמנה</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i}>
                    <td>{o.carNumber}</td>
                    <td>{o.details}</td>
                    <td>{o.cost} ₪</td>
                    <td>{new Date(o.orderDate).toLocaleDateString("he-IL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ✅ טבלת לקוחות חדשים */}
        {newCustomersList.length > 0 && (
          <>
            <h3 className="table-title">לקוחות חדשים החודש :</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>שם מלא</th>
                  <th>תעודת זהות</th>
                  <th>טלפון</th>
                  <th>אימייל</th>
                  <th>תאריך הצטרפות</th>
                </tr>
              </thead>
              <tbody>
                {newCustomersList.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.idNumber}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString("he-IL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>

      <button className="download-btn" onClick={handleDownloadPdf}>
        📥 הורד דוח כ־PDF
      </button>
    </div>
  );
};

export default MonthlyReportComponent;
