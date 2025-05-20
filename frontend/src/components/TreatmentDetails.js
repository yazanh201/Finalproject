import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TreatmentDetails.css";

const TreatmentDetails = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);
  console.log("📦 טיפול ID:", id);

  const BASE_URL = "http://localhost:5000/uploads/";
  const BASE_API_URL = "http://localhost:5000/";

  useEffect(() => {
    fetch(`${BASE_API_URL}api/treatments/${id}`)
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
          <div><strong>שם עובד:</strong> {treatment.workerName || "—"}</div>
          <div><strong>עלות:</strong> {treatment.cost} ₪</div>
          <div><strong>סטטוס:</strong> {treatment.status || "—"}</div>

          <div className="description">
            <strong>תיאור:</strong>
            <div>{treatment.description || "—"}</div>
          </div>
        </div>

        {treatment.invoiceFile && (
          <>
            <h4 className="mt-4">חשבונית:</h4>
            <div className="invoice-preview">
              {treatment.invoiceFile.endsWith(".pdf") ? (
                <a
                  href={`${BASE_URL}${treatment.invoiceFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  הצג חשבונית (PDF)
                </a>
              ) : (
                <img
                  src={`${BASE_URL}${treatment.invoiceFile}`}
                  alt="חשבונית"
                  className="invoice-image"
                />
              )}
            </div>
          </>
        )}

        {Array.isArray(treatment.images) && treatment.images.length > 0 && (
          <>
            <h4 className="mt-4">תמונות מהטיפול:</h4>
            <div className="treatment-images">
              {treatment.images.map((imgUrl, index) => (
                <a
                  key={index}
                  href={`${BASE_URL}${imgUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${BASE_URL}${imgUrl}`}
                    alt={`treatment-${index}`}
                    className="treatment-image"
                  />
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TreatmentDetails;
