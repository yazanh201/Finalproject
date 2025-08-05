// src/components/CustomerVehicles.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../Tabels/Modal"; // ✅ קומפוננטת מודאל לעריכת רכב

const CustomerVehicles = () => {
  const { customerId } = useParams(); // שליפת מזהה לקוח מה-URL
  const navigate = useNavigate();     // נווט לדפים אחרים

  const [vehicles, setVehicles] = useState([]);             // רשימת רכבים
  const [modalOpen, setModalOpen] = useState(false);        // האם המודאל פתוח
  const [selectedVehicle, setSelectedVehicle] = useState(null); // הרכב שנבחר לעריכה

  // useEffect - טוען את רכבי הלקוח כאשר משתנה ה־customerId
  useEffect(() => {
    fetchVehicles();
  }, [customerId]);

  // שליפת רכבים לפי מזהה לקוח
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cars/by-customer/${customerId}`);
      setVehicles(res.data);
    } catch (error) {
      console.error("❌ שגיאה בשליפת רכבים:", error.message);
    }
  };

  // פתיחת חלונית עריכה לרכב
  const handleEdit = (vehicle) => {
    setSelectedVehicle({ ...vehicle }); // שיבוט הנתונים לתוך state
    setModalOpen(true);
  };

  // סגירת מודאל
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVehicle(null);
  };

  // שמירת שינויים שנעשו ברכב
  const handleSave = async () => {
    try {
      const { _id, vehicleNumber, manufacturer, model, year, color, mileage } = selectedVehicle;

      // אימות שדות חובה
      if (!vehicleNumber || !manufacturer || !model || !year || !color) {
        alert("אנא מלא את כל השדות הנדרשים");
        return;
      }

      // שליחת PUT לעדכון רכב
      await axios.put(`http://localhost:5000/api/cars/${_id}`, {
        vehicleNumber,
        manufacturer,
        model,
        year,
        color,
        mileage,
      });

      alert("✅ רכב עודכן בהצלחה!");
      handleCloseModal(); // סגור מודאל
      fetchVehicles();    // רענן רשימת רכבים
    } catch (error) {
      console.error("❌ שגיאה בעדכון רכב:", error.message);
      alert("❌ שגיאה בעדכון רכב");
    }
  };

  // יצרנים לבחירה במודאל העריכה
  const carMakers = [
    "טויוטה", "יונדאי", "קיה", "מאזדה", "פורד", "סובארו", "שברולט",
    "פיאט", "אאודי", "ב.מ.וו", "מרצדס", "וולוו", "פיג'ו", "סיטרואן",
    "סקודה", "ניסאן", "רנו", "הונדה", "לקסוס"
  ];

  return (
    <div className="container mt-4" style={{ direction: 'rtl' }}>
      <h3 className="mb-4">רכבים של הלקוח</h3>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>⬅ חזור</button>

      {/* טבלת הצגת רכבים */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>מספר רכב</th>
            <th>יצרן</th>
            <th>דגם</th>
            <th>שנה</th>
            <th>צבע</th>
            <th>קילומטראז'</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((car, idx) => (
            <tr key={idx}>
              <td>{car.vehicleNumber}</td>
              <td>{car.manufacturer || "-"}</td>
              <td>{car.model || "-"}</td>
              <td>{car.year || "-"}</td>
              <td>{car.color || "-"}</td>
              <td>{car.mileage || 0}</td>
              <td>
                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(car)}>
                  ערוך
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal לעריכת רכב */}
      {modalOpen && selectedVehicle && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h4>עריכת רכב</h4>
          <form>
            {/* שדה יצרן */}
            <label>יצרן</label>
            <select
              className="form-control"
              value={selectedVehicle.manufacturer}
              onChange={(e) =>
                setSelectedVehicle({ ...selectedVehicle, manufacturer: e.target.value })
              }
            >
              <option value="">בחר יצרן</option>
              {carMakers.map((maker, index) => (
                <option key={index} value={maker}>{maker}</option>
              ))}
            </select>

            {/* שדה דגם */}
            <div className="form-group mb-2">
              <label>דגם</label>
              <input
                className="form-control"
                value={selectedVehicle.model}
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, model: e.target.value })}
              />
            </div>

            {/* שדה שנת ייצור */}
            <div className="form-group mb-2">
              <label>שנת ייצור</label>
              <input
                type="number"
                className="form-control"
                value={selectedVehicle.year}
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, year: e.target.value })}
              />
            </div>

            {/* שדה צבע */}
            <div className="form-group mb-2">
              <label>צבע</label>
              <input
                className="form-control"
                value={selectedVehicle.color}
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, color: e.target.value })}
              />
            </div>

            {/* שדה קילומטראז' */}
            <div className="form-group mb-2">
              <label>קילומטראז'</label>
              <input
                type="number"
                className="form-control"
                value={selectedVehicle.mileage}
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, mileage: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CustomerVehicles;
