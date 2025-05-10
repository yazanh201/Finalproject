import React, { useEffect, useState } from "react";
import Modal from "./Modal";  



const TreatmentsTable = ({ filterAppointment, filterTreatmentNumber, onNavigateToRepair, onNavigateToAppointment }) => {
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState({
    date: "",
    cost: "",
    workerId: "",
    typeId: "",
    carPlate: "",
    appointmentNumber: "",
    invoiceId: ""
  });

  // שליפת טיפולים מהשרת
  useEffect(() => {
    let url = "http://localhost:5000/api/treatments";
  
    if (filterTreatmentNumber) {
      url = `http://localhost:5000/api/treatments/by-id/${filterTreatmentNumber}`;
    } else if (filterAppointment) {
      url = `http://localhost:5000/api/treatments/by-appointment/${filterAppointment}`;
    }
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : [data];
        setTreatments(result);
      })
      .catch(err => console.error("❌ שגיאה בשליפת טיפולים:", err));
  }, [filterAppointment, filterTreatmentNumber]);
  
  
  

  const fetchTreatments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/treatments");
      const data = await res.json();
      setTreatments(data);
    } catch (error) {
      console.error("❌ שגיאה בשליפת טיפולים:", error);
    }
  };

  const handleShowModal = (type, treatment = null) => {
    setModalType(type);
    setSearchTerm("");
    if (type === "add") {
      setSelectedTreatment({
        date: "",
        cost: "",
        workerId: "",
        typeId: "",
        carPlate: "",
        appointmentNumber: "",
        invoiceId: ""
      });
    } else if (type === "edit" && treatment) {
      setSelectedTreatment(treatment);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTreatment(null);
    setSearchTerm("");
  };

  const handleSave = async () => {
    try {
      const method = modalType === "edit" ? "PUT" : "POST";
      const url =
        modalType === "edit"
          ? `http://localhost:5000/api/treatments/${selectedTreatment._id}`
          : "http://localhost:5000/api/treatments";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTreatment),
      });

      const data = await res.json();

      if (modalType === "edit") {
        setTreatments((prev) =>
          prev.map((t) => (t._id === data._id ? data : t))
        );
      } else {
        setTreatments((prev) => [data.treatment, ...prev]);
      }

      alert("✅ הטיפול נשמר בהצלחה!");
      handleCloseModal();
    } catch (error) {
      console.error("❌ שגיאה בשמירה:", error);
      alert("❌ שגיאה בשמירה");
    }
  };


  const handleSearchByDate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/treatments/by-date/${searchTerm}`);
      const data = await res.json();
      setTreatments(data);
      handleCloseModal();
    } catch (error) {
      console.error("❌ שגיאה בחיפוש לפי תאריך:", error);
    }
  };
  
  const handleSearchByCar = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/treatments/by-car/${searchTerm}`);
      const data = await res.json();
      setTreatments(data);
      handleCloseModal();
    } catch (error) {
      console.error("❌ שגיאה בחיפוש לפי רכב:", error);
    }
  };
  

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">טיפולים</h2>
      </div>

      <div className="d-flex mb-3 gap-2">
        <button className="btn btn-primary" onClick={() => handleShowModal("searchDate")}>
          חיפוש לפי תאריך
        </button>
        <button className="btn btn-primary" onClick={() => handleShowModal("searchCar")}>
          חיפוש לפי מספר רכב
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
              <th>עלות</th>
              <th>מזהה עובד</th>
              <th>סוג טיפול</th>
              <th>רכב</th>
              <th>מזהה תור</th>
              <th>חשבונית</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment._id}>
                <td>{treatment.treatmentId}</td>
                <td>{treatment.date}</td>
                <td>{treatment.cost}</td>
                <td>{treatment.workerId}</td>
                <td>
                  {treatment.repairTypeId ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof onNavigateToRepair === "function") {
                          onNavigateToRepair(treatment.repairTypeId);
                        }
                      }}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      {treatment.repairTypeId}
                    </a>
                  ) : (
                    <span style={{ color: "gray" }}>לא משויך</span>
                  )}
                </td>
                <td>{treatment.carPlate}</td>
                <td>
                  {treatment.appointmentNumber ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof onNavigateToAppointment === "function") {
                          onNavigateToAppointment(treatment.appointmentNumber);
                        }
                      }}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      {treatment.appointmentNumber}
                    </a>
                  ) : (
                    <span style={{ color: "gray" }}>—</span>
                  )}
                </td>
                <td>{treatment.invoiceId}</td>
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
          <h3>{modalType === "edit" ? "עריכת טיפול" : "הוספת טיפול חדש"}</h3>
          <form>
            {[
              { key: "date", label: "תאריך", type: "date" },
              { key: "cost", label: "עלות", type: "number" },
              { key: "workerId", label: "מזהה עובד" },
              { key: "typeId", label: "סוג טיפול" },
              { key: "carPlate", label: "מספר רכב" },
              { key: "appointmentNumber", label: "מזהה תור" },
              { key: "invoiceId", label: "מזהה חשבונית" },
            ].map(({ key, label, type = "text" }) => (
              <div className="form-group mb-3" key={key}>
                <label>{label}</label>
                <input
                  type={type}
                  className="form-control"
                  value={selectedTreatment?.[key] || ""}
                  onChange={(e) =>
                    setSelectedTreatment({ ...selectedTreatment, [key]: e.target.value })
                  }
                  required
                />
              </div>
            ))}
          </form>
        </Modal>
      )}

      {modalType === "searchDate" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSearchByDate}>
          <h3>חיפוש לפי תאריך</h3>
          <input
            type="date"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Modal>
      )}


      {modalType === "searchCar" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSearchByCar}>
          <h3>חיפוש לפי מספר רכב</h3>
          <input
            type="text"
            className="form-control"
            placeholder="הזן מספר רכב"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Modal>
      )}

    </div>
  );
};

export default TreatmentsTable;
