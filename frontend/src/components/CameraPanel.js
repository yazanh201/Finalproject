import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cssfiles/CameraPanel.css"; // נשתמש ב־CSS חיצוני לעיצוב

// קומפוננטה להצגת מצלמה, צילום תמונה ושליחת זיהוי לוחית רישוי
const CameraPanel = ({ onClose }) => {
  const webcamRef = useRef(null);       // רפרנס למצלמה
  const [image, setImage] = useState(null); // תמונה שצולמה
  const [plate, setPlate] = useState("");   // מספר לוחית שזוהה
  const [loading, setLoading] = useState(false); // סטטוס שליחה
  const navigate = useNavigate();       // נווט React Router

  // 📷 פעולה לצילום תמונה מהמצלמה
  const capturePhoto = () => {
    const screenshot = webcamRef.current.getScreenshot(); // צילום התמונה
    setImage(screenshot); // שמירת התמונה ל-state
  };

  // 📤 שליחת תמונה לשרת לזיהוי לוחית רישוי
  const submitPhoto = async () => {
    // בדיקה שהתמונה תקינה
    if (!image || !image.startsWith("data:image")) {
      alert("❌ אין תמונה תקינה.");
      return;
    }

    setLoading(true); // הצגת טוען
    try {
      // המרת Base64 ל־Blob
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("image", blob, "plate.png"); // צירוף קובץ לתמונה

      // קריאה ל־API לזיהוי לוחית רישוי
      const detectRes = await axios.post("https://plate-detector-trhb.onrender.com/api/plate-detect", formData);
      let { plateNumber } = detectRes.data;
      if (!plateNumber) throw new Error("לוחית לא זוהתה.");

      // ניקוי הלוחית מכל תווים לא ספרתיים
      const cleanedPlate = plateNumber.replace(/[^\d]/g, "");
      setPlate(cleanedPlate); // הצגת לוחית על המסך

      // בדיקה אם יש טיפול פתוח לרכב
      const checkRes = await axios.get("https://garage-backend-o8do.onrender.com/api/treatments/check", {
        params: { plate: cleanedPlate }
      });

      // קבלת תוצאה: האם יש טיפול פתוח ואם כן – פרטים
      const { exists, treatmentId, customerName, idNumber, workerName } = checkRes.data;
      if (exists) {
        // מעבר לטופס טיפול עם state רלוונטי
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
      setLoading(false); // סיום טעינה
    }
  };

  // 🖼️ ממשק משתמש - מציג מצלמה או תמונה שצולמה
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2 className="modal-title">📸 מצלמה</h2>

        {!image ? (
          <>
            {/* תצוגת מצלמה חיה */}
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-box"
              videoConstraints={{ facingMode: "environment" }} // מצלמה אחורית
            />
            {/* כפתורים לצילום וסגירה */}
            <div className="button-group">
              <button className="primary-btn" onClick={capturePhoto}>📷 צלם</button>
              <button className="cancel-btn" onClick={onClose}>❌ סגור</button>
            </div>
          </>
        ) : (
          <>
            {/* הצגת תמונה שצולמה */}
            <img src={image} alt="תמונה" className="webcam-box" />
            <div className="button-group">
              <button className="primary-btn" onClick={submitPhoto} disabled={loading}>
                {loading ? "⏳ שולח..." : "✅ שלח"}
              </button>
              <button className="cancel-btn" onClick={() => setImage(null)}>🔄 צלם שוב</button>
            </div>
          </>
        )}

        {/* הצגת לוחית רישוי שזוהתה */}
        {plate && <p className="plate-info">🔢 לוחית: <strong>{plate}</strong></p>}
      </div>
    </div>
  );
};

export default CameraPanel;
