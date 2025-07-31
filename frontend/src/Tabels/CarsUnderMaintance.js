import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "../Pages/cssfiles/TablesResponsive.css";

const CarsInService = () => {
  const [modalType, setModalType] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  // ✅ שליפת טיפולים
  useEffect(() => {
    fetch("http://localhost:5000/api/treatments")
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : [data];
        setTreatments(result);
      })
      .catch(err => console.error("❌ שגיאה בשליפת טיפולים:", err));
  }, []);

  const handleShowModal = (treatment) => {
    setModalType("edit");
    setSelectedTreatment({
      ...treatment,
      delayReason: treatment.delayReason || "",
      estimatedReleaseDate: treatment.estimatedReleaseDate || ""
    });
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTreatment(null);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/treatments/${selectedTreatment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delayReason: selectedTreatment.delayReason,
          estimatedReleaseDate: selectedTreatment.estimatedReleaseDate
        })
      });

      if (!res.ok) throw new Error("❌ שגיאה בשמירה");

      setTreatments(prev =>
        prev.map(t => (t._id === selectedTreatment._id ? selectedTreatment : t))
      );
      alert("✅ הנתונים נשמרו בהצלחה!");
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בשמירה");
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">רכבים בטיפול/תיקון</h2>
      </div>

      <div className="responsiveTableContainer">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מספר רישוי</th>
              <th>סטטוס טיפול</th>
              <th>תאריך כניסה</th>
              <th>סיבת עיכוב</th>
              <th>תאריך משוער לשחרור</th>
              <th>עריכה</th>
            </tr>
          </thead>
          <tbody>
            {treatments
              .filter(t => t.status !== "הסתיים")
              .map(treatment => (
                <tr key={treatment._id}>
                  <td>{treatment.carPlate}</td>
                  <td>{treatment.status || "—"}</td>
                  <td>{treatment.date || "—"}</td>
                  <td>{treatment.delayReason || "—"}</td>
                  <td>
                    {treatment.estimatedReleaseDate
                      ? new Date(treatment.estimatedReleaseDate).toLocaleDateString("he-IL")
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleShowModal(treatment)}
                    >
                      ערוך
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalType === "edit" && selectedTreatment && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת פרטי רכב בטיפול</h3>
          <div className="form-group mb-3">
            <label>סיבת עיכוב</label>
            <textarea
              className="form-control"
              value={selectedTreatment.delayReason}
              onChange={(e) =>
                setSelectedTreatment({ ...selectedTreatment, delayReason: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>תאריך משוער לשחרור</label>
            <input
              type="date"
              className="form-control"
              value={
                selectedTreatment.estimatedReleaseDate
                  ? new Date(selectedTreatment.estimatedReleaseDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setSelectedTreatment({
                  ...selectedTreatment,
                  estimatedReleaseDate: e.target.value
                })
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CarsInService;
