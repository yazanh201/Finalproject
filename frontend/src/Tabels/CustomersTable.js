import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal לשימוש בהצגת חלון קופץ

const Customers = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleShowModal = (type, customer = null) => {
    setModalType(type);
    setSelectedCustomer(customer);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedCustomer(null);
  };

  const handleSave = () => {
    if (modalType === "edit") {
      alert(`הפרטים של ${selectedCustomer?.name} עודכנו בהצלחה!`);
    } else {
      alert("לקוח נוסף בהצלחה!");
    }
    handleCloseModal();
  };

  const customers = [
    { id: 1, name: "יונתן לוי", idNumber: "123456789", phone: "050-123-4567", email: "yonatan@example.com", status: "פעיל", carNumber: "123-45-678" },
    { id: 2, name: "שרה כהן", idNumber: "987654321", phone: "052-987-6543", email: "sara@example.com", status: "לא פעיל", carNumber: "987-65-432" },
  ];

  return (
    <div>
      <div className="text-center">
        <h2 className="me-3">לקוחות</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף לקוח חדש
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("searchID")}>
          חיפוש לפי ת"ז או שם
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>שם לקוח</th>
            <th>ת"ז</th>
            <th>מספר טלפון</th>
            <th>מייל</th>
            <th>סטטוס</th>
            <th>מספר רישוי רכב</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.idNumber}</td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
              <td className={customer.status === "פעיל" ? "text-success" : "text-danger"}>{customer.status}</td>
              <td>{customer.carNumber}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", customer)}>
                  עריכה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === מודלים שונים === */}

      {/* מודל הוספת לקוח חדש */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת לקוח ורכב</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם לקוח</label>
              <input type="text" className="form-control" placeholder="הזן שם לקוח" required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" placeholder="הזן תעודת זהות" required />
            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <input type="text" className="form-control" placeholder="הזן מספר טלפון" required />
            </div>
            <div className="form-group mb-3">
              <label>מייל</label>
              <input type="email" className="form-control" placeholder="הזן מייל" required />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס</label>
              <select className="form-control" required>
                <option value="active">פעיל</option>
                <option value="inactive">לא פעיל</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>מספר רישוי רכב</label>
              <input type="text" className="form-control" placeholder="הזן מספר רישוי" required />
            </div>
          </form>
        </Modal>
      )}

      {/* מודל חיפוש לקוח לפי ת"ז או שם */}
      {modalType === "searchID" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש לקוח לפי תעודת זהות או שם</h3>
          <div className="form-group mb-3">
            <label>הזן ת"ז / שם</label>
            <input type="text" className="form-control" placeholder="תעודת זהות / שם" required />
          </div>
        </Modal>
      )}

      {/* מודל עריכת לקוח */}
      {modalType === "edit" && selectedCustomer && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת פרטי לקוח</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם לקוח</label>
              <input type="text" className="form-control" defaultValue={selectedCustomer.name} required />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input type="text" className="form-control" defaultValue={selectedCustomer.idNumber} required />
            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <input type="text" className="form-control" defaultValue={selectedCustomer.phone} required />
            </div>
            <div className="form-group mb-3">
              <label>מייל</label>
              <input type="email" className="form-control" defaultValue={selectedCustomer.email} required />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס</label>
              <select className="form-control" defaultValue={selectedCustomer.status} required>
                <option value="פעיל">פעיל</option>
                <option value="לא פעיל">לא פעיל</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>מספר רישוי רכב</label>
              <input type="text" className="form-control" defaultValue={selectedCustomer.carNumber} required />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Customers;
