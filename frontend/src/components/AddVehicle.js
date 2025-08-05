// ✅ קובץ AddVehicleDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // ✅ ייבוא toast להצגת הודעות

// קומפוננטה להשלמת פרטי רכב (לאחר הזנת מספר רישוי)
const AddVehicleDetails = () => {
  const { plateNumber } = useParams(); // שליפת מספר הרישוי מה-URL
  const navigate = useNavigate(); // לצורך ניווט לאחר עדכון

  // 🟢 סטייטים עבור שדות טופס הרכב
  const [vehicle, setVehicle] = useState(null); // פרטי הרכב הקיימים (אם קיימים)
  const [manufacturer, setManufacturer] = useState(""); // יצרן
  const [model, setModel] = useState(""); // דגם
  const [year, setYear] = useState(""); // שנת ייצור
  const [color, setColor] = useState(""); // צבע
  const [mileage, setMileage] = useState(""); // קילומטראז'

  // רשימת יצרני רכב לבחירה
  const carMakers = [
    "טויוטה", "יונדאי", "קיה", "מאזדה", "פורד", "סובארו", "שברולט",
    "פיאט", "אאודי", "ב.מ.וו", "מרצדס", "וולוו", "פיג'ו", "סיטרואן",
    "סקודה", "ניסאן", "רנו", "הונדה", "לקסוס"
  ];

  // 🔍 שליפת פרטי הרכב הקיימים לפי מספר רכב מתוך ה-URL
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cars?vehicleNumber=${plateNumber}`);
        setVehicle(res.data); // שמירת נתוני הרכב
        // מילוי השדות בטופס אם קיימים
        setManufacturer(res.data.manufacturer || "");
        setModel(res.data.model || "");
        setYear(res.data.year || "");
        setColor(res.data.color || "");
        setMileage(res.data.mileage || "");
      } catch (err) {
        alert("❌ לא ניתן למצוא את פרטי הרכב");
      }
    };
    fetchVehicle(); // קריאה לפונקציה
  }, [plateNumber]);

  // 💾 שליחת טופס עדכון פרטי הרכב לשרת
  const handleSave = async (e) => {
    e.preventDefault(); // מניעת רענון דף

    const currentYear = new Date().getFullYear(); // השנה הנוכחית לבדיקה

    // 🔎 בדיקות תקינות של כל שדה לפני שליחה
    if (!manufacturer || manufacturer.length < 2) return toast.error(" חובה להזין יצרן");
    if (!model) return toast.error(" חובה להזין דגם");
    if (!year || year < 1950 || year > currentYear) return toast.error(" שנת ייצור לא תקינה");
    if (!color || color.length < 2) return toast.error(" חובה להזין צבע");
    if (!mileage || mileage < 0) return toast.error(" קילומטראז' לא תקין");

    try {
      // שליחת בקשת PUT לעדכון פרטי הרכב
      await axios.put(`http://localhost:5000/api/cars/plate/${plateNumber}`, {
        manufacturer,
        model,
        year,
        color,
        mileage,
        vehicleNumber: plateNumber,
      });

      toast.success(" הרכב עודכן בהצלחה!"); // הודעת הצלחה
      navigate("/dashboard"); // מעבר חזרה ללוח הבקרה
    } catch (err) {
      console.error(err);
      toast.error(" שגיאה בעדכון הרכב");
    }
  };

  // בזמן טעינה – הצגת הודעה
  if (!vehicle) return <div className="text-center mt-5">🔄 טוען...</div>;

  // טופס הצגת ועדכון פרטי הרכב
  return (
    <div className="container mt-4" dir="rtl">
      <div className="card p-4 shadow">
        <h3 className="text-center">השלמת פרטי הרכב - {plateNumber}</h3>
        <form onSubmit={handleSave} className="row g-3">

          {/* שדה: יצרן */}
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

          {/* שדה: דגם */}
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

          {/* שדה: שנת ייצור */}
          <div className="col-md-6">
            <label className="form-label">שנת ייצור</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="">בחר שנה</option>
              {[...Array(new Date().getFullYear() - 1994).keys()].map(i => {
                const y = 1995 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>

          {/* שדה: צבע */}
          <div className="col-md-6">
            <label className="form-label">צבע</label>
            <select
              className="form-select"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            >
              <option value="">בחר צבע</option>
              {["לבן", "שחור", "אפור", "כסוף", "כחול", "אדום", "ירוק", "צהוב", "חום", "זהב", "בורדו"].map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* שדה: קילומטראז' */}
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

          {/* כפתור שמירה */}
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
