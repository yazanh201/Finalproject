import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import '../Pages/cssfiles/TablesResponsive.css'
/**
 * רכיב `CarsInService`
 * - מציג רשימת רכבים שנמצאים בטיפול.
 * - מאפשר הוספת רכב חדש לטיפול.
 * - מאפשר עריכת מידע על רכב בטיפול.
 */
const CarsInService = () => {
  const [modalType, setModalType] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState({
    carPlate: "",
    status: "in_progress",
    date: "",
    exitDate: "",
    workerId: ""
  });

  // שליפת נתונים מהשרת
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
    setModalType(type);
    if (type === "edit" && treatment) {
      setSelectedTreatment(treatment);
    } else {
      setSelectedTreatment({
        carPlate: "",
        status: "in_progress",
        date: "",
        exitDate: "",
        workerId: ""
      });
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

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">רכבים בטיפול/תיקון</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף רכב
        </button>
      </div>

      <div className="responsiveTableContainer">

        <table className="table table-striped">
          <thead>
            <tr>
              <th>מספר רישוי</th>
              <th>סטטוס טיפול</th>
              <th>תאריך כניסה</th>
              <th>תאריך יציאה</th>
              <th>מזהה עובד</th>
              <th>פעולה</th>
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
                  <td>{treatment.exitDate || "—"}</td>
                  <td>{treatment.workerId || "—"}</td>
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

      {(modalType === "add" || modalType === "edit") && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>{modalType === "edit" ? "עריכת רכב בטיפול" : "הוספת רכב לטיפול"}</h3>
          <form>
            <div className="form-group mb-3">
              <label>מספר רישוי</label>
              <input
                type="text"
                className="form-control"
                value={selectedTreatment?.carPlate || ""}
                onChange={(e) =>
                  setSelectedTreatment({ ...selectedTreatment, carPlate: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>סטטוס טיפול</label>
              <select
                className="form-control"
                value={selectedTreatment?.status}
                onChange={(e) =>
                  setSelectedTreatment({ ...selectedTreatment, status: e.target.value })
                }
              >
                <option value="in_progress">בטיפול</option>
                <option value="waiting_parts">ממתין לחלקים</option>
                <option value="completed">הטיפול הסתיים</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>תאריך כניסה</label>
              <input
                type="date"
                className="form-control"
                value={selectedTreatment?.date || ""}
                onChange={(e) =>
                  setSelectedTreatment({ ...selectedTreatment, date: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>תאריך יציאה</label>
              <input
                type="date"
                className="form-control"
                value={selectedTreatment?.exitDate || ""}
                onChange={(e) =>
                  setSelectedTreatment({ ...selectedTreatment, exitDate: e.target.value })
                }
              />
            </div>

            <div className="form-group mb-3">
              <label>מזהה עובד</label>
              <input
                type="text"
                className="form-control"
                value={selectedTreatment?.workerId || ""}
                onChange={(e) =>
                  setSelectedTreatment({ ...selectedTreatment, workerId: e.target.value })
                }
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CarsInService;
