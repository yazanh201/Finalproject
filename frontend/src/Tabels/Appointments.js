import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal להצגת חלון קופץ

const Appointments = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleShowModal = (type, appointment = null) => {
    setModalType(type);
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedAppointment(null);
  };

  const handleSave = () => {
    if (modalType === "edit") {
      alert(`התור #${selectedAppointment?.id} עודכן בהצלחה!`);
    } else {
      alert("תור נוסף בהצלחה!");
    }
    handleCloseModal();
  };

  const appointments = [
    { id: "4001", date: "08/01/2025", time: "09:00", description: "החלפת שמן מנוע", idNumber: "123456789", name: "יונתן לוי", carNumber: "123-45-678", treatmentId: "3001" },
    { id: "4002", date: "08/01/2025", time: "10:00", description: "בדיקת מערכת בלמים", idNumber: "987654321", name: "שרה כהן", carNumber: "987-65-432", treatmentId: "3002" },
  ];

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">תורים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף תור חדש
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("searchID")}>
          חיפוש לפי תעודת זהות
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("searchDate")}>
          בחירת תאריך להצגת תורים
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מזהה תור</th>
              <th>תאריך</th>
              <th>שעה</th>
              <th>תיאור</th>
              <th>תעודת זהות</th>
              <th>שם לקוח</th>
              <th>מספר רישוי רכב</th>
              <th>מזהה טיפול</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.description}</td>
                <td>{appointment.idNumber}</td>
                <td>{appointment.name}</td>
                <td>{appointment.carNumber}</td>
                <td>{appointment.treatmentId}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", appointment)}>
                    עריכה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === מודלים שונים לפי `modalType` === */}

      {/* מודל הוספת תור */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת תור חדש</h3>
          <form>
            <div className="form-group mb-3">
              <label>תאריך</label>
              <input type="date" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>שעה</label>
              <input type="time" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>תיאור</label>
              <input type="text" className="form-control" placeholder="תיאור הטיפול" required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" placeholder="הזן תעודת זהות" required />
            </div>
            <div className="form-group mb-3">
              <label>שם לקוח</label>
              <input type="text" className="form-control" placeholder="הזן שם לקוח" required />
            </div>
            <div className="form-group mb-3">
              <label>מספר רישוי רכב</label>
              <input type="text" className="form-control" placeholder="הזן מספר רישוי" required />
            </div>
          </form>
        </Modal>
      )}

      {/* מודל חיפוש תור לפי ת"ז */}
      {modalType === "searchID" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש תורים לפי תעודת זהות</h3>
          <div className="form-group mb-3">
            <label>הזן תעודת זהות</label>
            <input type="text" className="form-control" placeholder="תעודת זהות" required />
          </div>
        </Modal>
      )}

      {/* מודל חיפוש תור לפי תאריך */}
      {modalType === "searchDate" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש תורים לפי תאריך</h3>
          <div className="form-group mb-3">
            <label>בחר תאריך</label>
            <input type="date" className="form-control" required />
          </div>
        </Modal>
      )}

      {/* מודל עריכת תור */}
      {modalType === "edit" && selectedAppointment && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת תור</h3>
          <form>
            <div className="form-group mb-3">
              <label>תאריך</label>
              <input type="date" className="form-control" defaultValue={selectedAppointment.date} required />
            </div>
            <div className="form-group mb-3">
              <label>שעה</label>
              <input type="time" className="form-control" defaultValue={selectedAppointment.time} required />
            </div>
            <div className="form-group mb-3">
              <label>תיאור</label>
              <input type="text" className="form-control" defaultValue={selectedAppointment.description} required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" defaultValue={selectedAppointment.idNumber} required />
            </div>
            <div className="form-group mb-3">
              <label>שם לקוח</label>
              <input type="text" className="form-control" defaultValue={selectedAppointment.name} required />
            </div>
            <div className="form-group mb-3">
              <label>מספר רישוי רכב</label>
              <input type="text" className="form-control" defaultValue={selectedAppointment.carNumber} required />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Appointments;
