// src/components/CameraPlateCapture.jsx
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const CameraPlateCapture = ({ onPlateDetected }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plate, setPlate] = useState("");

  const capturePhoto = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const submitPhoto = async () => {
    setLoading(true);
    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'plate.jpg');

      const response = await axios.post('http://localhost:5000/api/plate-detect', formData);
      const { plateNumber } = response.data;
      setPlate(plateNumber);
      onPlateDetected?.(plateNumber); // optional callback
    } catch (err) {
      alert("❌ זיהוי לוחית נכשל. ודא שהתמונה ברורה");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!image && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={{ facingMode: "environment" }}
          />
          <br />
          <button onClick={capturePhoto}>📸 צלם</button>
        </>
      )}

      {image && (
        <>
          <img src={image} alt="captured" width={400} style={{ marginTop: 10 }} />
          <br />
          <button onClick={submitPhoto} disabled={loading}>
            {loading ? "⏳ שולח..." : "✅ שלח לזיהוי"}
          </button>
          <br />
          <button onClick={() => setImage(null)}>🔄 נסה שוב</button>
        </>
      )}

      {plate && (
        <div style={{ marginTop: 20 }}>
          <strong>🔢 לוחית שזוהתה:</strong> {plate}
        </div>
      )}
    </div>
  );
};

export default CameraPlateCapture;
