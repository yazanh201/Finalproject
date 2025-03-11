import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב המודל

const TreatmentTypes = () => {
  // State לניהול המודל ולשמירת הנתונים לעריכה
  const [modalType, setModalType] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null); // נתוני השורה שנערכים

  // פונקציה לפתיחת המודל עם הנתונים הרלוונטיים
  const handleShowModal = (type, treatment = null) => {
    setModalType(type);
    setSelectedTreatment(treatment); // אם זה "עריכה", נטען את הנתונים
  };

  // פונקציה לסגירת המודל
  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTreatment(null);
  };

  // פונקציה לשמירת הנתונים
  const handleSave = () => {
    if (modalType === "edit") {
      alert(`סוג טיפול ${selectedTreatment?.id} עודכן בהצלחה!`);
      // בעתיד - כאן יבוצע שליחת הנתונים למסד נתונים ב-API
    } else {
      alert("סוג טיפול נוסף בהצלחה!");
    }
    handleCloseModal();
  };

  // נתוני סוגי טיפולים לדוגמה (בעתיד יגיעו ממסד נתונים)
  const treatments = [
    { id: 6001, name: "החלפת שמן", description: "החלפת שמן מנוע", repairId: 3001 },
    { id: 6002, name: "תיקון בלמים", description: "החלפת רפידות בלמים", repairId: 3002 },
    { id: 6003, name: "יישור גלגלים", description: "כוונון זווית גלגלים", repairId: 3003 },
  ];

  return (
    <div>
      {/* כותרת ראשית */}
      <div className="text-center mb-4">
        <h2 className="me-3">סוגי טיפולים/תיקונים</h2>
      </div>

      {/* כפתורים */}
      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף סוג טיפול חדש
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>
          חיפוש סוג טיפול
        </button>
      </div>

      {/* טבלה */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מזהה</th>
              <th>שם סוג טיפול</th>
              <th>תיאור</th>
              <th>מזהה טיפול</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment.id}>
                <td>{treatment.id}</td>
                <td>{treatment.name}</td>
                <td>{treatment.description}</td>
                <td>{treatment.repairId}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleShowModal("edit", treatment)}
                  >
                    עריכה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* מודל הוספת סוג טיפול */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת סוג טיפול חדש</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם סוג טיפול</label>
              <input type="text" className="form-control" placeholder="הזן שם סוג טיפול" required />
            </div>

            <div className="form-group mb-3">
              <label>תיאור</label>
              <textarea className="form-control" placeholder="הזן תיאור" required></textarea>
            </div>
          </form>
        </Modal>
      )}

      {/* מודל חיפוש סוג טיפול */}
      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש סוג טיפול</h3>
          <div className="form-group mb-3">
            <label>הזן מזהה טיפול</label>
            <input type="text" className="form-control" placeholder="חיפוש..." required />
          </div>
        </Modal>
      )}

      {/* מודל עריכת סוג טיפול */}
      {modalType === "edit" && selectedTreatment && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת סוג טיפול</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם סוג טיפול</label>
              <input
                type="text"
                className="form-control"
                defaultValue={selectedTreatment.name} // טוען את המידע מהשורה שנבחרה
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>תיאור</label>
              <textarea
                className="form-control"
                defaultValue={selectedTreatment.description} // טוען את התיאור
                required
              ></textarea>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TreatmentTypes;
