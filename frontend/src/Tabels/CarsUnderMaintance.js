import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import '../Pages/cssfiles/TablesResponsive.css'

const CarsInService = () => {
  const [modalType, setModalType] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/treatments")
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : [data];
        setTreatments(result);
      })
      .catch(err => console.error("❌ שגיאה בשליפת טיפולים:", err));
  }, []);

  const handleShowModal = (type, treatment = null) => {
    if (type === "edit" && treatment) {
      setModalType("edit");
      setSelectedTreatment(treatment);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTreatment(null);
  };

  const handleSave = () => {
    alert("הרכב עודכן בהצלחה!");
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את הרכב הזה מהרשימה?")) return;
    try {
      await fetch(`http://localhost:5000/api/treatments/${id}`, {
        method: "DELETE",
      });
      setTreatments((prev) => prev.filter((t) => t._id !== id));
      alert("✅ הרכב הוסר מרשימת הטיפולים בהצלחה!");
    } catch (err) {
      console.error("❌ שגיאה במחיקת רכב בטיפול:", err);
      alert("❌ שגיאה במחיקה");
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
              <th>מזהה עובד</th>
            </tr>
          </thead>
          <tbody>
            {treatments
              .filter(t => t.status !== "הסתיים")
              .map((treatment) => (
                <tr key={treatment._id}>
                  <td>{treatment.carPlate}</td>
                  <td>{treatment.status || "—"}</td>
                  <td>{treatment.date || "—"}</td>
                  <td>{treatment.workerId || "—"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalType === "edit" && selectedTreatment && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת רכב בטיפול</h3>
          <form>
            {/* כל השדות לעריכה */}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CarsInService;
