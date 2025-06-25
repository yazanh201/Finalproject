// ✅ קובץ AddVehicleDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // ✅ ייבוא toast

const AddVehicleDetails = () => {
  const { plateNumber } = useParams();
  const navigate = useNavigate();

  // 🟢 סטייטים עבור שדות הרכב
  const [vehicle, setVehicle] = useState(null);
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState("");

  const carMakers = [
    "טויוטה", "יונדאי", "קיה", "מאזדה", "פורד", "סובארו", "שברולט",
    "פיאט", "אאודי", "ב.מ.וו", "מרצדס", "וולוו", "פיג'ו", "סיטרואן",
    "סקודה", "ניסאן", "רנו", "הונדה", "לקסוס"
  ];

  // 🔍 שליפת פרטי הרכב לפי מספר רכב מה-URL
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cars?vehicleNumber=${plateNumber}`);
        setVehicle(res.data);
        setManufacturer(res.data.manufacturer || "");
        setModel(res.data.model || "");
        setYear(res.data.year || "");
        setColor(res.data.color || "");
        setMileage(res.data.mileage || "");
      } catch (err) {
        alert("❌ לא ניתן למצוא את פרטי הרכב");
      }
    };
    fetchVehicle();
  }, [plateNumber]);

  // 💾 שליחה לעדכון
   const handleSave = async (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();

    if (!manufacturer || manufacturer.length < 2) return toast.error(" חובה להזין יצרן");
    if (!model) return toast.error(" חובה להזין דגם");
    if (!year || year < 1950 || year > currentYear) return toast.error(" שנת ייצור לא תקינה");
    if (!color || color.length < 2) return toast.error(" חובה להזין צבע");
    if (!mileage || mileage < 0) return toast.error(" קילומטראז' לא תקין");

    try {
      await axios.put(`http://localhost:5000/api/cars/plate/${plateNumber}`, {
        manufacturer,
        model,
        year,
        color,
        mileage,
        vehicleNumber: plateNumber,
      });
      toast.success(" הרכב עודכן בהצלחה!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(" שגיאה בעדכון הרכב");
    }
  };
  if (!vehicle) return <div className="text-center mt-5">🔄 טוען...</div>;

  return (
    <div className="container mt-4" dir="rtl">
      <div className="card p-4 shadow">
        <h3 className="text-center">השלמת פרטי הרכב - {plateNumber}</h3>
        <form onSubmit={handleSave} className="row g-3">

          <div className="col-md-6">
            <label className="form-label">יצרן</label>
            <select
              className="form-select"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              required
            >
              <option value="">בחר יצרן</option>
              {carMakers.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">דגם</label>
            <input
              type="text"
              className="form-control"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">שנת ייצור</label>
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">צבע</label>
            <input
              type="text"
              className="form-control"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">קילומטראז'</label>
            <input
              type="number"
              className="form-control"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-success px-5">
              שמירה
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddVehicleDetails;
