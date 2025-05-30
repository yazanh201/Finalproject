// src/components/CustomerVehicles.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../Tabels/Modal";

const CustomerVehicles = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [customerId]);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cars/by-customer/${customerId}`);
      setVehicles(res.data);
    } catch (error) {
      console.error("❌ שגיאה בשליפת רכבים:", error.message);
    }
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle({ ...vehicle });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleSave = async () => {
    try {
      const { _id, vehicleNumber, manufacturer, model, year, color, mileage } = selectedVehicle;

      // אימותים בסיסיים
      if (!vehicleNumber || !manufacturer || !model || !year || !color) {
        alert("אנא מלא את כל השדות הנדרשים");
        return;
      }

      await axios.put(`http://localhost:5000/api/cars/${_id}`, {
        vehicleNumber,
        manufacturer,
        model,
        year,
        color,
        mileage,
      });

      alert("✅ רכב עודכן בהצלחה!");
      handleCloseModal();
      fetchVehicles();
    } catch (error) {
      console.error("❌ שגיאה בעדכון רכב:", error.message);
      alert("❌ שגיאה בעדכון רכב");
    }
  };

  const carMakers = [
  "טויוטה", "יונדאי", "קיה", "מאזדה", "פורד", "סובארו", "שברולט",
  "פיאט", "אאודי", "ב.מ.וו", "מרצדס", "וולוו", "פיג'ו", "סיטרואן",
  "סקודה", "ניסאן", "רנו", "הונדה", "לקסוס"
];


  return (
    <div className="container mt-4" style={{ direction: 'rtl' }}>
      <h3 className="mb-4">רכבים של הלקוח</h3>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>⬅ חזור</button>

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

            <div className="form-group mb-2">
              <label>דגם</label>
              <input
                className="form-control"
                value={selectedVehicle.model}
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, model: e.target.value })}
              />
            </div>
            <div className="form-group mb-2">
              <label>שנת ייצור</label>
              <input
                type="number"
                className="form-control"
                value={selectedVehicle.year}
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, year: e.target.value })}
              />
            </div>
            <div className="form-group mb-2">
              <label>צבע</label>
              <input
                className="form-control"
                value={selectedVehicle.color}
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, color: e.target.value })}
              />
            </div>
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
