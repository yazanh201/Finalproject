import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal להצגת חלון קופץ

const Employees = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleShowModal = (type, employee = null) => {
    setModalType(type);
    setSelectedEmployee(employee);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedEmployee(null);
  };

  const handleSave = () => {
    if (modalType === "edit") {
      alert(`העובד ${selectedEmployee?.fullName} עודכן בהצלחה!`);
    } else {
      alert("העובד נוסף בהצלחה!");
    }
    handleCloseModal();
  };

  const employees = [
    { id: "5001", idNumber: "123456789", fullName: "יוסי כהן", role: "מכונאי", email: "yossi@example.com", phone: "050-123-4567", status: "פעיל" },
    { id: "5002", idNumber: "987654321", fullName: "דנה לוי", role: "מנהלת משרד", email: "dana@example.com", phone: "052-987-6543", status: "פעיל" },
  ];

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">עובדים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף עובד חדש
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>
          חיפוש לפי תעודת זהות או שם
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מזהה עובד</th>
              <th>תעודת זהות</th>
              <th>שם מלא</th>
              <th>תפקיד</th>
              <th>אימייל</th>
              <th>מספר טלפון</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.idNumber}</td>
                <td>{employee.fullName}</td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td className={employee.status === "פעיל" ? "text-success" : "text-danger"}>{employee.status}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", employee)}>
                    עריכה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === מודלים שונים לפי `modalType` === */}

      {/* מודל הוספת עובד */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת עובד חדש</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם מלא</label>
              <input type="text" className="form-control" placeholder="שם העובד" required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" placeholder="תעודת זהות" required />
            </div>
            <div className="form-group mb-3">
              <label>תפקיד</label>
              <input type="text" className="form-control" placeholder="תפקיד העובד" required />
            </div>
            <div className="form-group mb-3">
              <label>אימייל</label>
              <input type="email" className="form-control" placeholder="אימייל העובד" required />
            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <input type="text" className="form-control" placeholder="מספר טלפון" required />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס</label>
              <select className="form-control">
                <option value="פעיל">פעיל</option>
                <option value="לא פעיל">לא פעיל</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* מודל חיפוש עובד לפי שם/תעודת זהות */}
      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש עובד</h3>
          <div className="form-group mb-3">
            <label>תעודת זהות או שם</label>
            <input type="text" className="form-control" placeholder="הזן תעודת זהות או שם" required />
          </div>
        </Modal>
      )}

      {/* מודל עריכת עובד */}
      {modalType === "edit" && selectedEmployee && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת עובד</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם מלא</label>
              <input type="text" className="form-control" defaultValue={selectedEmployee.fullName} required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" defaultValue={selectedEmployee.idNumber} required />
            </div>
            <div className="form-group mb-3">
              <label>תפקיד</label>
              <input type="text" className="form-control" defaultValue={selectedEmployee.role} required />
            </div>
            <div className="form-group mb-3">
              <label>אימייל</label>
              <input type="email" className="form-control" defaultValue={selectedEmployee.email} required />
            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <input type="text" className="form-control" defaultValue={selectedEmployee.phone} required />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס</label>
              <select className="form-control" defaultValue={selectedEmployee.status}>
                <option value="פעיל">פעיל</option>
                <option value="לא פעיל">לא פעיל</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Employees;
