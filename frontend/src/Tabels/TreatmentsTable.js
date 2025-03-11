import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal להצגת חלון קופץ

const TreatmentsTable = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const handleShowModal = (type, treatment = null) => {
    setModalType(type);
    setSelectedTreatment(treatment);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTreatment(null);
  };

  const handleSave = () => {
    if (modalType === "edit") {
      alert(`הטיפול ${selectedTreatment?.id} עודכן בהצלחה!`);
    } else {
      alert("הטיפול נוסף בהצלחה!");
    }
    handleCloseModal();
  };

  const treatments = [
    { id: "3001", date: "08/01/2025", cost: "800", workerId: "5001", typeId: "6001", carPlate: "123-45-678", appointmentId: "4001", invoiceId: "7001" },
    { id: "3002", date: "07/01/2025", cost: "1200", workerId: "5002", typeId: "6002", carPlate: "987-65-432", appointmentId: "4002", invoiceId: "7002" },
    { id: "3003", date: "09/01/2025", cost: "600", workerId: "5003", typeId: "6003", carPlate: "321-54-876", appointmentId: "4003", invoiceId: "7003" },
    { id: "3001", date: "08/01/2025", cost: "800", workerId: "5001", typeId: "6001", carPlate: "123-45-678", appointmentId: "4001", invoiceId: "7001" },
    { id: "3002", date: "07/01/2025", cost: "1200", workerId: "5002", typeId: "6002", carPlate: "987-65-432", appointmentId: "4002", invoiceId: "7002" },
    { id: "3003", date: "09/01/2025", cost: "600", workerId: "5003", typeId: "6003", carPlate: "321-54-876", appointmentId: "4003", invoiceId: "7003" },
    { id: "3001", date: "08/01/2025", cost: "800", workerId: "5001", typeId: "6001", carPlate: "123-45-678", appointmentId: "4001", invoiceId: "7001" },
    { id: "3002", date: "07/01/2025", cost: "1200", workerId: "5002", typeId: "6002", carPlate: "987-65-432", appointmentId: "4002", invoiceId: "7002" },
    { id: "3003", date: "09/01/2025", cost: "600", workerId: "5003", typeId: "6003", carPlate: "321-54-876", appointmentId: "4003", invoiceId: "7003" },
    { id: "3001", date: "08/01/2025", cost: "800", workerId: "5001", typeId: "6001", carPlate: "123-45-678", appointmentId: "4001", invoiceId: "7001" },
    { id: "3002", date: "07/01/2025", cost: "1200", workerId: "5002", typeId: "6002", carPlate: "987-65-432", appointmentId: "4002", invoiceId: "7002" },
    { id: "3003", date: "09/01/2025", cost: "600", workerId: "5003", typeId: "6003", carPlate: "321-54-876", appointmentId: "4003", invoiceId: "7003" },
    { id: "3001", date: "08/01/2025", cost: "800", workerId: "5001", typeId: "6001", carPlate: "123-45-678", appointmentId: "4001", invoiceId: "7001" },
    { id: "3002", date: "07/01/2025", cost: "1200", workerId: "5002", typeId: "6002", carPlate: "987-65-432", appointmentId: "4002", invoiceId: "7002" },
    { id: "3003", date: "09/01/2025", cost: "600", workerId: "5003", typeId: "6003", carPlate: "321-54-876", appointmentId: "4003", invoiceId: "7003" },
  ];

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">טיפולים</h2>
      </div>

      <div className="d-flex mb-3 gap-2">
        <button className="btn btn-primary" onClick={() => handleShowModal("searchDate")}>
          בחירת תאריך להצגת טיפולים
        </button>
        <button className="btn btn-primary" onClick={() => handleShowModal("searchCar")}>
          חיפוש טיפולים לפי מספר רכב
        </button>
        <button className="btn btn-primary" onClick={() => handleShowModal("add")}>
          הוספת טיפול
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מזהה טיפול</th>
              <th>תאריך</th>
              <th>עלות (ש"ח)</th>
              <th>מזהה עובד</th>
              <th>מזהה סוג טיפול</th>
              <th>מספר רישוי רכב</th>
              <th>מזהה תור</th>
              <th>מזהה חשבונית</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment.id}>
                <td>{treatment.id}</td>
                <td>{treatment.date}</td>
                <td>{treatment.cost}</td>
                <td>{treatment.workerId}</td>
                <td>{treatment.typeId}</td>
                <td>{treatment.carPlate}</td>
                <td>{treatment.appointmentId}</td>
                <td>{treatment.invoiceId}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", treatment)}>
                    עדכון
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === מודלים שונים לפי `modalType` === */}

      {/* מודל הוספת טיפול */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת טיפול חדש</h3>
          <form>
            <div className="form-group mb-3">
              <label>תאריך</label>
              <input type="date" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>עלות (ש"ח)</label>
              <input type="number" className="form-control" placeholder="הזן עלות" required />
            </div>
            <div className="form-group mb-3">
              <label>מזהה עובד</label>
              <input type="text" className="form-control" placeholder="הזן מזהה עובד" required />
            </div>
            <div className="form-group mb-3">
              <label>מזהה סוג טיפול</label>
              <input type="text" className="form-control" placeholder="הזן מזהה סוג טיפול" required />
            </div>
            <div className="form-group mb-3">
              <label>מספר רישוי רכב</label>
              <input type="text" className="form-control" placeholder="הזן מספר רכב" required />
            </div>
          </form>
        </Modal>
      )}

      {/* מודל חיפוש טיפולים לפי מספר רכב */}
      {modalType === "searchCar" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש טיפולים לפי מספר רכב</h3>
          <div className="form-group mb-3">
            <label>מספר רישוי רכב</label>
            <input type="text" className="form-control" placeholder="הזן מספר רכב" required />
          </div>
        </Modal>
      )}

      {/* מודל חיפוש טיפולים לפי תאריך */}
      {modalType === "searchDate" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש טיפולים לפי תאריך</h3>
          <div className="form-group mb-3">
            <label>בחר תאריך</label>
            <input type="date" className="form-control" required />
          </div>
        </Modal>
      )}

      {/* מודל עריכת טיפול */}
      {modalType === "edit" && selectedTreatment && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת טיפול</h3>
          <form>
            <div className="form-group mb-3">
              <label>תאריך</label>
              <input type="date" className="form-control" defaultValue={selectedTreatment.date} required />
            </div>
            <div className="form-group mb-3">
              <label>עלות (ש"ח)</label>
              <input type="number" className="form-control" defaultValue={selectedTreatment.cost} required />
            </div>
            <div className="form-group mb-3">
              <label>מזהה עובד</label>
              <input type="text" className="form-control" defaultValue={selectedTreatment.workerId} required />
            </div>
            <div className="form-group mb-3">
              <label>מזהה סוג טיפול</label>
              <input type="text" className="form-control" defaultValue={selectedTreatment.typeId} required />
            </div>
            <div className="form-group mb-3">
              <label>מספר רישוי רכב</label>
              <input type="text" className="form-control" defaultValue={selectedTreatment.carPlate} required />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TreatmentsTable;
