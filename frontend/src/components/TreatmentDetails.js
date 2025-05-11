import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TreatmentDetails.css";

const TreatmentDetails = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/treatments/${id}`)
      .then(res => res.json())
      .then(setTreatment)
      .catch(err => console.error("❌ שגיאה בשליפת טיפול:", err));
  }, [id]);

  if (!treatment) return <div className="text-center mt-5">טוען פרטי טיפול...</div>;

  return (
    <div className="treatment-container">
      <div className="treatment-card">
        <h2 className="treatment-title">פרטי טיפול</h2>

        <div className="treatment-info-grid">
          <div><strong>שם לקוח:</strong> {treatment.customerName || "—"}</div>
          <div><strong>מספר רכב:</strong> {treatment.carPlate}</div>
          <div><strong>תאריך:</strong> {treatment.date}</div>
          <div><strong>סוג טיפול:</strong> {treatment.treatmentType || "—"}</div>
          <div><strong>שם עובד:</strong> {treatment.workerName || "—"}</div>
          <div><strong>עלות:</strong> {treatment.cost} ₪</div>
          <div className="description">
            <strong>תיאור:</strong>
            <div>{treatment.description || "—"}</div>
          </div>
        </div>

        {Array.isArray(treatment.images) && treatment.images.length > 0 && (
          <>
            <h4 className="mt-4">תמונות מהטיפול:</h4>
            <div className="treatment-images">
              {treatment.images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`treatment-${index}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TreatmentDetails;
