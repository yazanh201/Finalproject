// src/components/CameraPlateCapture.jsx
import React, { useRef, useState } from 'react'; // יבוא React וה־hooks useRef ו־useState
import Webcam from 'react-webcam'; // רכיב מצלמה שמאפשר לצלם תמונות
import axios from 'axios'; // ספרייה לשליחת בקשות HTTP

// קומפוננטת צילום לוחית רישוי מהמצלמה
const CameraPlateCapture = ({ onPlateDetected }) => {
  const webcamRef = useRef(null); // הפניה לרכיב המצלמה
  const [image, setImage] = useState(null); // שמירה של התמונה שצולמה
  const [loading, setLoading] = useState(false); // סטטוס שליחת התמונה
  const [plate, setPlate] = useState(""); // מספר לוחית שזוהה

  // פעולה לצילום תמונה מתוך המצלמה
  const capturePhoto = () => {
    const screenshot = webcamRef.current.getScreenshot(); // צילום המסך מהמצלמה
    setImage(screenshot); // שמירת התמונה
  };

  // פעולה לשליחת התמונה לשרת לצורך זיהוי לוחית
  const submitPhoto = async () => {
    setLoading(true); // הצגת טעינה

    try {
      // המרת התמונה ל־blob (קובץ בינארי)
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'plate.jpg'); // הוספת התמונה לטופס

      // שליחת התמונה לשרת לניתוח
      const response = await axios.post('http://localhost:5000/api/plate-detect', formData);
      const { plateNumber } = response.data; // קבלת מספר הלוחית מהשרת

      setPlate(plateNumber); // הצגת לוחית שזוהתה

      // קריאה לפונקציה חיצונית אם קיימת (callback)
      onPlateDetected?.(plateNumber);
    } catch (err) {
      alert("❌ זיהוי לוחית נכשל. ודא שהתמונה ברורה"); // הודעת שגיאה
      console.error(err); // הדפסת השגיאה לקונסול
    } finally {
      setLoading(false); // סיום טעינה
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* הצגת המצלמה אם לא קיימת תמונה */}
      {!image && (
        <>
          <Webcam
            audio={false} // ביטול קול
            ref={webcamRef} // הפניה למצלמה
            screenshotFormat="image/jpeg" // פורמט צילום
            width={400} // רוחב
            videoConstraints={{ facingMode: "environment" }} // שימוש במצלמה אחורית
          />
          <br />
          <button onClick={capturePhoto}>📸 צלם</button> {/* כפתור לצילום תמונה */}
        </>
      )}

      {/* אם קיימת תמונה, נציג אותה ואת כפתורי הפעולה */}
      {image && (
        <>
          <img src={image} alt="captured" width={400} style={{ marginTop: 10 }} /> {/* הצגת התמונה */}
          <br />
          <button onClick={submitPhoto} disabled={loading}>
            {loading ? "⏳ שולח..." : "✅ שלח לזיהוי"} {/* הצגת מצב טעינה או כפתור רגיל */}
          </button>
          <br />
          <button onClick={() => setImage(null)}>🔄 נסה שוב</button> {/* ניקוי התמונה וניסיון נוסף */}
        </>
      )}

      {/* הצגת לוחית אם זוהתה */}
      {plate && (
        <div style={{ marginTop: 20 }}>
          <strong>🔢 לוחית שזוהתה:</strong> {plate}
        </div>
      )}
    </div>
  );
};

export default CameraPlateCapture; // ייצוא הקומפוננטה
