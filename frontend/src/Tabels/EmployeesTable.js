import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import DynamicTable from "./DynamicTable";

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

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h2>עובדים</h2>
      </div>

      <div className="d-flex mb-3">
        <button
          className="btn btn-primary me-3"
          onClick={() => handleShowModal("add")}
        >
          הוסף עובד חדש
        </button>
      </div>

      <DynamicTable
        title=""
        headers={headers}
        data={employees}
        actionLabel="עריכה"
        onRowAction={(emp) => handleShowModal("edit", emp)}
      />

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
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      [key]: e.target.value,
                    })
                  }
                  required
                />
              </div>
            ))}

            <div className="form-group mb-3">
              <label>סטטוס</label>
              <select
                className="form-control"
                value={selectedEmployee.status}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    status: e.target.value,
                  })
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
