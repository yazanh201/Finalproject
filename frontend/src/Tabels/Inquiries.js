import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const Inquiries = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [newInquiry, setNewInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "פתוחה",
  });
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/inquiries");
        const data = await res.json();
        setInquiries(data);
      } catch (err) {
        console.error("שגיאה בשליפת פניות:", err);
      }
    };
    fetchInquiries();
  }, []);

  const handleShowModal = (type, inquiry = null) => {
    setModalType(type);
    setSelectedInquiry(inquiry);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedInquiry(null);
  };

  const handleSave = async () => {
  if (modalType === "edit") {
    try {
      const response = await fetch(`http://localhost:5000/api/inquiries/${selectedInquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedInquiry),
      });
      const updated = await response.json();
      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq._id === updated._id ? updated : inq))
        );
        alert("✅ הפנייה עודכנה בהצלחה!");
      } else {
        alert("❌ שגיאה בעדכון הפנייה");
      }
    } catch (err) {
      console.error("❌ שגיאה:", err);
      alert("❌ שגיאה בעדכון");
    }
  }
  handleCloseModal();
};

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchSearch =
      inquiry.name.includes(searchTerm) || inquiry.phone.includes(searchTerm);
  
    const matchStatus = showOnlyOpen ? inquiry.status === "פתוחה" : true;
  
    const matchDate = filterDate
      ? new Date(inquiry.createdAt).toISOString().split("T")[0] === filterDate
      : true;
  
    return matchSearch && matchStatus && matchDate;
  });

  const handleDelete = async (id) => {
  if (!window.confirm("האם אתה בטוח שברצונך למחוק את הפנייה הזו?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      alert("✅ הפנייה נמחקה בהצלחה!");
      setInquiries((prev) => prev.filter((inq) => inq._id !== id)); // מסיר מהטבלה
    } else {
      alert(data.message || "❌ שגיאה במחיקת הפנייה");
    }
  } catch (err) {
    console.error("❌ שגיאה במחיקה:", err);
    alert("❌ שגיאה בחיבור לשרת");
  }
};

  

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">פניות</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>
          חיפוש לפי מספר טלפון או שם
        </button>
        <button
          className="btn btn-primary me-3"
          onClick={() => setShowOnlyOpen(!showOnlyOpen)}
        >
          {showOnlyOpen ? "הצג הכול" : "הצג רק פניות פתוחות"}
        </button>
        <input
          type="date"
          className="form-control me-3"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ maxWidth: "200px" }}
        />


      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
          <tr>
            <th>#</th>
            <th>שם לקוח</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>הודעה</th>
            <th>סטטוס</th>
            <th>תאריך פנייה</th>
            <th>פעולות</th>
          </tr>

          </thead>
          <tbody>
            {filteredInquiries.map((inquiry, index) => (
              <tr key={inquiry._id}>
                <td>{index + 1}</td>
                <td>{inquiry.name}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.phone}</td>
                <td>{inquiry.message}</td>
                <td className={inquiry.status === "פתוחה" ? "text-success" : "text-danger"}>{inquiry.status}</td>
                <td>{new Date(inquiry.createdAt).toLocaleDateString('he-IL')}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => handleShowModal("edit", inquiry)}>
                    ערוך
                  </button>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleDelete(inquiry._id)}
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === מודלים === */}
      {modalType === "edit" && selectedInquiry && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת פנייה</h3>
          <form>
            <input type="text" className="form-control mb-2" value={selectedInquiry.name} onChange={(e) => setSelectedInquiry({ ...selectedInquiry, name: e.target.value })} required />
            <input type="email" className="form-control mb-2" value={selectedInquiry.email} onChange={(e) => setSelectedInquiry({ ...selectedInquiry, email: e.target.value })} required />
            <input type="text" className="form-control mb-2" value={selectedInquiry.phone} onChange={(e) => setSelectedInquiry({ ...selectedInquiry, phone: e.target.value })} required />
            <textarea className="form-control mb-2" value={selectedInquiry.message} onChange={(e) => setSelectedInquiry({ ...selectedInquiry, message: e.target.value })} required />
            <select className="form-control mb-2" value={selectedInquiry.status} onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value })}>
              <option value="פתוחה">פתוחה</option>
              <option value="סגורה">סגורה</option>
            </select>
          </form>
        </Modal>
      )}

      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש פנייה</h3>
          <input type="text" className="form-control" placeholder="הזן שם או טלפון" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Modal>
      )}
    </div>
  );
};

export default Inquiries;