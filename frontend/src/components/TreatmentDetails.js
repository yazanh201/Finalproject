import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./cssfiles/TreatmentDetails.css";

const TreatmentDetails = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);

  const BASE_URL = "http://localhost:5000/uploads/";
  const BASE_API_URL = "http://localhost:5000/";

  useEffect(() => {
    fetch(`${BASE_API_URL}api/treatments/${id}`)
      .then((res) => res.json())
      .then(setTreatment)
      .catch((err) => console.error("❌ שגיאה בשליפת טיפול:", err));
  }, [id]);

  if (!treatment) {
    return <div className="text-center mt-5">טוען פרטי טיפול...</div>;
  }

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

        {Array.isArray(treatment.treatmentServices) && treatment.treatmentServices.length > 0 && (
          <div className="mt-4">
            <h4>שירותים שבוצעו:</h4>
            {treatment.treatmentServices.map((category, idx) => {
              let options = category?.selectedOptions;

              // אם selectedOptions הוא מחרוזת – ננסה לפענח אותו
              if (typeof options === "string") {
                try {
                  options = JSON.parse(options);
                } catch (err) {
                  console.warn("⚠️ שגיאה בפענוח selectedOptions:", options);
                  options = [];
                }
              }

              return (
                <div key={idx} className="mb-2">
                  <strong>{category?.category || "ללא קטגוריה"}:</strong>
                  {Array.isArray(options) && options.length > 0 ? (
                    <ul>
                      {options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted">— אין שירותים נבחרים</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
