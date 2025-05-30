import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cssfiles/CameraPanel.css"; // נשתמש ב־CSS חיצוני לעיצוב

const CameraPanel = ({ onClose }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const capturePhoto = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const submitPhoto = async () => {
  if (!image || !image.startsWith("data:image")) {
    alert("❌ אין תמונה תקינה.");
    return;
  }

  setLoading(true);
  try {
    const blob = await (await fetch(image)).blob();
    const formData = new FormData();
    formData.append("image", blob, "plate.png");

    const detectRes = await axios.post("http://localhost:3300/api/plate-detect", formData);
    let { plateNumber } = detectRes.data;
    if (!plateNumber) throw new Error("לוחית לא זוהתה.");

    const cleanedPlate = plateNumber.replace(/[^\d]/g, "");
    setPlate(cleanedPlate);

    const checkRes = await axios.get("http://localhost:5000/api/treatments/check", {
      params: { plate: cleanedPlate }
    });

    // קבל את הטיפול הקיים עם מזהה טיפול
    const { exists, treatmentId, customerName, idNumber, workerName } = checkRes.data;
    if (exists) {
      navigate("/create-treatment", {
        state: {
          plateNumber: cleanedPlate,
          customerName,
          idNumber,
          workerName,
          treatmentId  // 💡 הוספת מזהה טיפול לזיהוי עדכון
        }
      });
    } else {
      alert("🚫 לא נמצא טיפול פתוח לרכב זה.");
    }
  } catch (err) {
    alert("❌ שגיאה בזיהוי הלוחית.");
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
              videoConstraints={{ facingMode: "environment" }}
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
