import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const Repairtypes = ({ filterRepairId, onNavigateToTreatment }) => {
  const [modalType, setModalType] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // שליפת סוגי טיפולים מהשרת
  useEffect(() => {
    fetch("http://localhost:5000/api/repairtypes")
      .then((res) => res.json())
      .then((data) => {
        setTreatments(data);
        if (filterRepairId) {
          setSearchTerm(filterRepairId.toString());
        }
      })
      .catch((err) => console.error("שגיאה בשליפת סוגי טיפולים:", err));
  }, [filterRepairId]);
  

  const handleShowModal = (type, treatment = null) => {
    setModalType(type);
    setSelectedTreatment(treatment);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTreatment(null);
    setSearchTerm("");
  };

  const handleSave = async () => {
    const method = modalType === "edit" ? "PUT" : "POST";
    const url =
      modalType === "edit"
        ? `http://localhost:5000/api/repairtypes/${selectedTreatment._id}`
        : "http://localhost:5000/api/repairtypes";

    try {
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
        setTreatments((prev) => [data.repairtype, ...prev]);
      }

      alert("✅ נשמר בהצלחה");
      handleCloseModal();
    } catch (err) {
      console.error("❌ שגיאה בשמירה:", err);
      alert("❌ שגיאה בשמירה");
    }
  };

  const filteredTreatments = treatments.filter((t) =>
    t.repairId?.toString().includes(searchTerm)
  );
  

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">סוגי טיפולים/תיקונים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>הוסף סוג טיפול חדש</button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>חיפוש סוג טיפול</button>
      </div>

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
            {filteredTreatments.map((t) => (
              <tr key={t._id}>
                <td>{t.repairId}</td>  {/* ✅ מזהה סוג טיפול - מספר רץ 7001 */}
                <td>{t.name}</td>
                <td>{t.description}</td>
                <td>
                  {t.treatmentId ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof onNavigateToTreatment === "function") {
                          onNavigateToTreatment(t.treatmentId); // שלח את המזהה לטיפול
                        }
                      }}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      {t.treatmentId}
                    </a>
                  ) : (
                    <span style={{ color: "gray" }}>לא משויך</span>
                  )}
                </td>

                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", t)}>עריכה</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {(modalType === "add" || modalType === "edit") && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>{modalType === "edit" ? "עריכת סוג טיפול" : "הוספת סוג טיפול חדש"}</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם סוג טיפול</label>
              <input
                type="text"
                className="form-control"
                value={selectedTreatment?.name || ""}
                onChange={(e) => setSelectedTreatment({ ...selectedTreatment, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>תיאור</label>
              <textarea
                className="form-control"
                value={selectedTreatment?.description || ""}
                onChange={(e) => setSelectedTreatment({ ...selectedTreatment, description: e.target.value })}
                required
              />
            </div>
          </form>
        </Modal>
      )}

      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש סוג טיפול</h3>
          <div className="form-group mb-3">
            <label>הזן מזהה טיפול</label>
            <input
              type="text"
              className="form-control"
              placeholder="חיפוש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Repairtypes;
