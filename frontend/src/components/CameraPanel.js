import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cssfiles/CameraPanel.css";

const CameraPanel = ({ onClose }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // למעלה בקובץ
// למעלה בקובץ - פנייה ישירות לכתובת הענן
const PLATE_API = "https://plate-detector-trhb.onrender.com";
const GARAGE_API = "https://garage-backend-o8do.onrender.com";


  const capturePhoto = () => {
    // דרוש HTTPS כדי שהמצלמה תעבוד בדפדפן
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      alert("המצלמה דורשת אתר ב-HTTPS. פתח את האתר בכתובת מאובטחת.");
      return;
    }
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      alert("לא הצלחתי לצלם. נסה שוב.");
      return;
    }
    setImage(screenshot);
  };

  const submitPhoto = async () => {
    if (!image || !image.startsWith("data:image")) {
      alert("❌ אין תמונה תקינה.");
      return;
    }

    setLoading(true);
    try {
      // המרת dataURL ל-Blob
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("image", blob, "plate.jpg");

      // 🔎 זיהוי לוחית
     const detectRes = await axios.post(`${PLATE_API}/api/plate-detect`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
  timeout: 20000,
});


      const { plateNumber } = detectRes.data || {};
      if (!plateNumber) throw new Error("לוחית לא זוהתה.");

      const cleanedPlate = String(plateNumber).replace(/[^\d]/g, "");
      if (!cleanedPlate) throw new Error("לוחית לא זוהתה.");
      setPlate(cleanedPlate);

      // 🔎 בדיקת טיפול פתוח לרכב
   const checkRes = await axios.get(
  `${GARAGE_API}/api/treatments/check`,
  { params: { plate: cleanedPlate }, timeout: 15000 }
);


      const { exists, treatmentId, customerName, idNumber, workerName } = checkRes.data || {};
      if (exists) {
        navigate("/create-treatment", {
          state: {
            plateNumber: cleanedPlate,
            customerName: customerName || "",
            idNumber: idNumber || "",
            workerName: workerName || "",
            treatmentId: treatmentId || "",
          },
        });
      } else {
        alert("🚫 לא נמצא טיפול פתוח לרכב זה.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          alert("❌ הלוחית לא זוהתה. נסה לצלם שוב מזווית טובה יותר.");
        } else {
          alert(`❌ שגיאת רשת/שרת: ${err.response?.status || err.code || "לא ידוע"}`);
        }
      } else {
        alert(`❌ שגיאה: ${err.message || "אירעה תקלה"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2 className="modal-title">📸 מצלמה</h2>

        {!image ? (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-box"
              videoConstraints={{ facingMode: { ideal: "environment" } }}
            />
            <div className="button-group">
              <button className="primary-btn" onClick={capturePhoto}>📷 צלם</button>
              <button className="cancel-btn" onClick={onClose}>❌ סגור</button>
            </div>
          </>
        ) : (
          <>
            <img src={image} alt="תמונה" className="webcam-box" />
            <div className="button-group">
              <button className="primary-btn" onClick={submitPhoto} disabled={loading}>
                {loading ? "⏳ שולח..." : "✅ שלח"}
              </button>
              <button className="cancel-btn" onClick={() => setImage(null)}>🔄 צלם שוב</button>
            </div>
          </>
        )}

        {plate && <p className="plate-info">🔢 לוחית: <strong>{plate}</strong></p>}
      </div>
    </div>
  );
};

export default CameraPanel;
