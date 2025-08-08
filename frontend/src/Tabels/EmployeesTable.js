import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import "../Pages/cssfiles/TablesResponsive.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]); // רשימת העובדים
  const [modalType, setModalType] = useState(null); // סוג המודאל: add/edit
  const [selectedEmployee, setSelectedEmployee] = useState({
    idNumber: "",
    fullName: "",
    role: "",
    email: "",
    phone: "",
  });

  // ✅ שליפת עובדים בעת טעינה
  useEffect(() => {
    fetch("https://garage-backend-o8do.onrender.com/api/employees")

      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("❌ שגיאה בשליפת עובדים:", err));
  }, []);

  // ✅ פתיחת מודאל
  const handleShowModal = (type, employee = null) => {
    setModalType(type);
    if (type === "add") {
      // אם הוספה – נקה את השדות
      setSelectedEmployee({
        idNumber: "",
        fullName: "",
        role: "",
        email: "",
        phone: "",
      });
    } else if (type === "edit" && employee) {
      // אם עריכה – טען את הנתונים לעובד שנבחר
      setSelectedEmployee(employee);
    }
  };

  // ✅ סגירת מודאל
  const handleCloseModal = () => {
    setModalType(null);
    setSelectedEmployee(null);
  };

  // ✅ שמירה – הוספה או עדכון
  const handleSave = async () => {
    // בדיקת ולידציה – כל השדות חובה
    if (
      !selectedEmployee.idNumber ||
      !selectedEmployee.fullName ||
      !selectedEmployee.role ||
      !selectedEmployee.email ||
      !selectedEmployee.phone
    ) {
      alert("❌ יש למלא את כל השדות לפני שמירה");
      return;
    }

    try {
const method = modalType === "edit" ? "PUT" : "POST";
const url =
  modalType === "edit"
    ? `https://garage-backend-o8do.onrender.com/api/employees/${selectedEmployee._id}`
    : "https://garage-backend-o8do.onrender.com/api/employees";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedEmployee),
      });

      const data = await res.json();

      if (modalType === "edit") {
        // עדכון עובד קיים
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === data._id ? data : emp))
        );
        alert("✅ עובד עודכן בהצלחה!");
      } else {
        // הוספת עובד חדש
        setEmployees((prev) => [data, ...prev]);
        alert("✅ עובד נוסף בהצלחה!");
      }

      handleCloseModal();
    } catch (err) {
      console.error("❌ שגיאה בשמירת עובד:", err);
      alert("❌ שגיאה בשמירת עובד");
    }
  };

  // ✅ מחיקת עובד
  const handleDelete = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את העובד הזה?")) return;
    try {
      await fetch(`https://garage-backend-o8do.onrender.com/api/employees/${id}`, {
  method: "DELETE"
});

      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      alert("✅ העובד נמחק בהצלחה!");
    } catch (err) {
      console.error("❌ שגיאה במחיקת עובד:", err);
      alert("❌ שגיאה במחיקת עובד");
    }
  };


  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h2>עובדים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף עובד חדש
        </button>
      </div>

      <div className="responsiveTableContainer">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ת.ז</th>
              <th>שם מלא</th>
              <th>תפקיד</th>
              <th>אימייל</th>
              <th>טלפון</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.idNumber}</td>
                <td>{emp.fullName}</td>
                <td>{emp.role}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleShowModal("edit", emp)}
                  >
                    עריכה
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(emp._id)}
                  >
                    מחיקה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modalType === "add" || modalType === "edit") && selectedEmployee && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>{modalType === "edit" ? "עריכת עובד" : "הוספת עובד חדש"}</h3>
          <form>
            {/* תעודת זהות */}
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input
                type="text"
                className="form-control"
                value={selectedEmployee.idNumber || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // ✅ רק מספרים
                  setSelectedEmployee({ ...selectedEmployee, idNumber: value });
                }}
                maxLength={9}
                minLength={9}
                inputMode="numeric"
                required
              />
            </div>

            {/* שם מלא */}
            <div className="form-group mb-3">
              <label>שם מלא</label>
              <input
                type="text"
                className="form-control"
                value={selectedEmployee.fullName || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^א-תa-zA-Z\s]/g, ""); // ✅ רק אותיות
                  setSelectedEmployee({ ...selectedEmployee, fullName: value });
                }}
                required
              />
            </div>

            {/* תפקיד */}
            <div className="form-group mb-3">
              <label>תפקיד</label>
              <select
                className="form-control"
                value={selectedEmployee.role || ""}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, role: e.target.value })
                }
                required
              >
                <option value="">בחר תפקיד</option>
                <option value="מכונאי">מכונאי</option>
                <option value="חשמלאי">חשמלאי</option>
                <option value="עובד ניקיון">עובד ניקיון</option>
              </select>
            </div>

            {/* אימייל */}
            <div className="form-group mb-3">
              <label>אימייל</label>
              <input
                type="email"
                className="form-control"
                value={selectedEmployee.email || ""}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                }
                required
              />
            </div>

            {/* טלפון */}
            <div className="form-group mb-3">
              <label>טלפון</label>
              <input
                type="text"
                className="form-control"
                value={selectedEmployee.phone || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // ✅ רק מספרים
                  setSelectedEmployee({ ...selectedEmployee, phone: value });
                }}
                maxLength={10}
                minLength={9}
                inputMode="numeric"
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Employees;
