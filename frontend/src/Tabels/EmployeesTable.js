import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import DynamicTable from "./DynamicTable";


import "../Pages/cssfiles/TablesResponsive.css"; // הוספת קובץ CSS לגלילה אופקית

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState({
    idNumber: "",
    fullName: "",
    role: "",
    email: "",
    phone: "",
    status: "פעיל",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("❌ שגיאה בשליפת עובדים:", err));
  }, []);

  const handleShowModal = (type, employee = null) => {
    setModalType(type);
    if (type === "add") {
      setSelectedEmployee({
        idNumber: "",
        fullName: "",
        role: "",
        email: "",
        phone: "",
        status: "פעיל",
      });
    } else if (type === "edit" && employee) {
      setSelectedEmployee(employee);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedEmployee(null);
  };

  const handleSave = async () => {
    try {
      const method = modalType === "edit" ? "PUT" : "POST";
      const url =
        modalType === "edit"
          ? `http://localhost:5000/api/employees/${selectedEmployee._id}`
          : "http://localhost:5000/api/employees";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedEmployee),
      });

      const data = await res.json();

      if (modalType === "edit") {
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === data._id ? data : emp))
        );
        alert("✅ עובד עודכן בהצלחה!");
      } else {
        setEmployees((prev) => [data, ...prev]);
        alert("✅ עובד נוסף בהצלחה!");
      }

      handleCloseModal();
    } catch (err) {
      console.error("❌ שגיאה בשמירת עובד:", err);
      alert("❌ שגיאה בשמירת עובד");
    }
  };

  const headers = [
    { key: "idNumber", label: "ת.ז" },
    { key: "fullName", label: "שם מלא" },
    { key: "role", label: "תפקיד" },
    { key: "email", label: "אימייל" },
    { key: "phone", label: "טלפון" },
    { key: "status", label: "סטטוס" },
  ];

  const handleDelete = async (id) => {
  if (!window.confirm("האם אתה בטוח שברצונך למחוק את העובד הזה?")) return;
  try {
    await fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE",
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
            <th>סטטוס</th>
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
              <td>{emp.status}</td>
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
              pattern="[0-9]*"
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
                const value = e.target.value.replace(/[^א-תa-zA-Z\s]/g, ""); // ✅ רק אותיות ורווחים
                setSelectedEmployee({ ...selectedEmployee, fullName: value });
              }}
              required
            />
          </div>

          {/* תפקיד */}
          <div className="form-group mb-3">
            <label>תפקיד</label>
            <input
              type="text"
              className="form-control"
              value={selectedEmployee.role || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^א-תa-zA-Z\s]/g, ""); // ✅ רק טקסט
                setSelectedEmployee({ ...selectedEmployee, role: value });
              }}
              required
            />
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
              pattern="[0-9]*"
              required
            />
          </div>

          {/* סטטוס */}
          <div className="form-group mb-3">
            <label>סטטוס</label>
            <select
              className="form-control"
              value={selectedEmployee.status}
              onChange={(e) =>
                setSelectedEmployee({ ...selectedEmployee, status: e.target.value })
              }
            >
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
