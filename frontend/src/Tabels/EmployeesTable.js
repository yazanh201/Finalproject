import React, { useEffect, useState } from "react";
import Modal from "./Modal";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState({
    idNumber: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    status: "פעיל",
  });

  // שליפת עובדים מהשרת
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
        name: "",
        position: "",
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
        setEmployees((prev) => [data, ...prev]); // ⬅️ data במקום data.employee
        alert("✅ עובד נוסף בהצלחה!");
      }

      handleCloseModal();
    } catch (err) {
      console.error("❌ שגיאה בשמירת עובד:", err);
      alert("❌ שגיאה בשמירת עובד");
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">עובדים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף עובד חדש
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ת.ז</th>
              <th>שם מלא</th>
              <th>תפקיד</th>
              <th>אימייל</th>
              <th>טלפון</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.idNumber}</td>
                <td>{employee.fullName}</td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td className={employee.status === "פעיל" ? "text-success" : "text-danger"}>
                  {employee.status}
                </td>
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

      {/* === מודל הוספה / עריכה === */}
      {(modalType === "add" || modalType === "edit") && selectedEmployee && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>{modalType === "edit" ? "עריכת עובד" : "הוספת עובד חדש"}</h3>
          <form>
            {[
              { label: "תעודת זהות", key: "idNumber" },
              { label: "שם מלא", key: "fullName" },
              { label: "תפקיד", key: "role" },
              { label: "אימייל", key: "email", type: "email" },
              { label: "טלפון", key: "phone" },
            ].map(({ label, key, type = "text" }) => (
              <div className="form-group mb-3" key={key}>
                <label>{label}</label>
                <input
                  type={type}
                  className="form-control"
                  value={selectedEmployee[key] || ""}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, [key]: e.target.value })}
                  required
                />
              </div>
            ))}

            <div className="form-group mb-3">
              <label>סטטוס</label>
              <select
                className="form-control"
                value={selectedEmployee.status}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, status: e.target.value })}
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
