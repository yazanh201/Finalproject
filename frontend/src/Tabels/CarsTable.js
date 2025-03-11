import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal לשימוש בהצגת חלון קופץ

const CarsTable = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  const handleShowModal = (type, car = null) => {
    setModalType(type);
    setSelectedCar(car);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedCar(null);
  };

  const handleSave = () => {
    if (modalType === "edit") {
      alert(`פרטי רכב מספר ${selectedCar?.carNumber} עודכנו בהצלחה!`);
    } else {
      alert("רכב נוסף בהצלחה!");
    }
    handleCloseModal();
  };

  const cars = [
    { id: 1, carNumber: "123-45-678", owner: "יונתן לוי", ownerID: "123456789", brand: "טויוטה", model: "קורולה", year: 2020, color: "לבן" },
    { id: 2, carNumber: "987-65-432", owner: "שרה כהן", ownerID: "987654321", brand: "פורד", model: "טרנזיט", year: 2018, color: "כחול" },
  ];

  return (
    <div>
      <div className="text-center">
        <h2 className="me-3">רכבים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף רכב
        </button>

        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>
          חפש לפי מספר רכב או ת.ז
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>מספר רכב</th>
            <th>שם בעל הרכב</th>
            <th>תעודת זהות בעל הרכב</th>
            <th>יצרן</th>
            <th>דגם</th>
            <th>שנת ייצור</th>
            <th>צבע</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.id}</td>
              <td>{car.carNumber}</td>
              <td>{car.owner}</td>
              <td>{car.ownerID}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{car.color}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", car)}>
                  עריכה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === מודלים שונים === */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת רכב חדש</h3>
          <form>
            <div className="form-group mb-3">
              <label>מספר רכב</label>
              <input type="text" className="form-control" placeholder="הזן מספר רכב" required />
            </div>
            <div className="form-group mb-3">
              <label>שם בעל הרכב</label>
              <input type="text" className="form-control" placeholder="הזן שם בעל הרכב" required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" placeholder="הזן תעודת זהות" required />
            </div>
            <div className="form-group mb-3">
              <label>יצרן</label>
              <input type="text" className="form-control" placeholder="הזן יצרן" required />
            </div>
            <div className="form-group mb-3">
              <label>דגם</label>
              <input type="text" className="form-control" placeholder="הזן דגם" required />
            </div>
            <div className="form-group mb-3">
              <label>שנת ייצור</label>
              <input type="number" className="form-control" placeholder="הזן שנת ייצור" required />
            </div>
            <div className="form-group mb-3">
              <label>צבע</label>
              <input type="text" className="form-control" placeholder="הזן צבע" required />
            </div>
          </form>
        </Modal>
      )}

      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש רכב</h3>
          <div className="form-group mb-3">
            <label>הזן מספר רכב או תעודת זהות</label>
            <input type="text" className="form-control" placeholder="חיפוש רכב" required />
          </div>
        </Modal>
      )}

      {modalType === "edit" && selectedCar && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת רכב</h3>
          <form>
            <div className="form-group mb-3">
              <label>מספר רכב</label>
              <input type="text" className="form-control" defaultValue={selectedCar.carNumber} required />
            </div>
            <div className="form-group mb-3">
              <label>שם בעל הרכב</label>
              <input type="text" className="form-control" defaultValue={selectedCar.owner} required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" defaultValue={selectedCar.ownerID} required />
            </div>
            <div className="form-group mb-3">
              <label>יצרן</label>
              <input type="text" className="form-control" defaultValue={selectedCar.brand} required />
            </div>
            <div className="form-group mb-3">
              <label>דגם</label>
              <input type="text" className="form-control" defaultValue={selectedCar.model} required />
            </div>
            <div className="form-group mb-3">
              <label>שנת ייצור</label>
              <input type="number" className="form-control" defaultValue={selectedCar.year} required />
            </div>
            <div className="form-group mb-3">
              <label>צבע</label>
              <input type="text" className="form-control" defaultValue={selectedCar.color} required />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CarsTable;
