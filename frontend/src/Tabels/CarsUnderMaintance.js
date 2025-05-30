import React, { useState, useEffect } from "react";

const CarsInService = () => {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    // שליפת הטיפולים מהשרת
    fetch("http://localhost:5000/api/treatments")
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : [data];
        setTreatments(result);
      })
      .catch(err => console.error("❌ שגיאה בשליפת טיפולים:", err));
  }, []);

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">רכבים בטיפול/תיקון</h2>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מספר רישוי</th>
              <th>סטטוס טיפול</th>
              <th>תאריך טיפול</th>
              <th>מזהה עובד</th>
            </tr>
          </thead>
          <tbody>
            {treatments
              .filter(t => t.status !== "הסתיים") // 🔥 שינוי מ"בהמתנה" ל"בטיפול"
              .map(t => (
                <tr key={t._id}>
                  <td>{t.carPlate}</td>
                  <td>{t.status || "—"}</td>
                  <td>{t.date}</td>
                  <td>{t.workerId || "—"}</td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default CarsInService;
