import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal להצגת חלון קופץ

const Inquiries = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const handleShowModal = (type, inquiry = null) => {
    setModalType(type);
    setSelectedInquiry(inquiry);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedInquiry(null);
  };

  const handleSave = () => {
    if (modalType === "edit") {
      alert(`הפרטים של הפנייה #${selectedInquiry?.id} עודכנו בהצלחה!`);
    } else {
      alert("פנייה נוספה בהצלחה!");
    }
    handleCloseModal();
  };

  const inquiries = [
    { id: "001", name: "יונתן לוי", email: "yonatan.levi@example.com", phone: "050-1234567", date: "07/01/2025", description: "רעש במנוע", status: "פתוחה" },
    { id: "002", name: "שרה כהן", email: "sara.kohen@example.com", phone: "052-9876543", date: "08/01/2025", description: "החלפת שמן", status: "סגורה" },
  ];

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">פניות</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוספת פנייה
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>
          חיפוש לפי מספר טלפון או שם
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>מספר פנייה</th>
              <th>שם לקוח</th>
              <th>מייל</th>
              <th>מספר טלפון</th>
              <th>תאריך פנייה</th>
              <th>תיאור פנייה</th>
              <th>סטטוס פנייה</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry, index) => (
              <tr key={inquiry.id}>
                <td>{index + 1}</td>
                <td>{inquiry.id}</td>
                <td>{inquiry.name}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.phone}</td>
                <td>{inquiry.date}</td>
                <td>{inquiry.description}</td>
                <td className={inquiry.status === "פתוחה" ? "text-success" : "text-danger"}>
                  {inquiry.status}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", inquiry)}>
                    עדכון
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === מודלים שונים לפי `modalType` === */}

      {/* מודל הוספת פנייה */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת פנייה חדשה</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם לקוח</label>
              <input type="text" className="form-control" placeholder="הזן שם לקוח" required />
            </div>
            <div className="form-group mb-3">
              <label>מייל</label>
              <input type="email" className="form-control" placeholder="הזן מייל" required />
            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <input type="text" className="form-control" placeholder="הזן מספר טלפון" required />
            </div>
            <div className="form-group mb-3">
              <label>תיאור פנייה</label>
              <textarea className="form-control" placeholder="פרטי הפנייה" required />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס פנייה</label>
              <select className="form-control" required>
                <option value="פתוחה">פתוחה</option>
                <option value="סגורה">סגורה</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* מודל חיפוש פנייה לפי מספר טלפון או שם */}
      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש פנייה</h3>
          <div className="form-group mb-3">
            <label>מספר טלפון או שם</label>
            <input type="text" className="form-control" placeholder="הזן מספר טלפון או שם" required />
          </div>
        </Modal>
      )}

      {/* מודל עריכת פנייה */}
      {modalType === "edit" && selectedInquiry && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת פנייה</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם לקוח</label>
              <input type="text" className="form-control" defaultValue={selectedInquiry.name} required />
            </div>
            <div className="form-group mb-3">
              <label>מייל</label>
              <input type="email" className="form-control" defaultValue={selectedInquiry.email} required />
            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <input type="text" className="form-control" defaultValue={selectedInquiry.phone} required />
            </div>
            <div className="form-group mb-3">
              <label>תיאור פנייה</label>
              <textarea className="form-control" defaultValue={selectedInquiry.description} required />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס פנייה</label>
              <select className="form-control" defaultValue={selectedInquiry.status} required>
                <option value="פתוחה">פתוחה</option>
                <option value="סגורה">סגורה</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Inquiries;
