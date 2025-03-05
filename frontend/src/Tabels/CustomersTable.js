import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal לשימוש בהצגת חלון קופץ

/**
 * רכיב הלקוחות (Customers)
 * מציג טבלת לקוחות, ומאפשר פתיחת חלון קופץ להוספת לקוח חדש ורכב.
 */
const Customers = () => {
  // State לניהול פתיחה וסגירה של חלון המודל
  const [showModal, setShowModal] = useState(false);

  // פונקציה לפתיחת חלון המודל
  const handleShowModal = () => setShowModal(true);

  // פונקציה לסגירת חלון המודל
  const handleCloseModal = () => setShowModal(false);

  // פונקציה המדמה שמירת נתונים (תוכל להוסיף לוגיקה אמיתית מאחורי הקלעים)
  const handleSave = () => {
    alert("לקוח ורכב נוספו בהצלחה!"); // הודעה למשתמש
    handleCloseModal(); // סגירת החלון לאחר שמירה
  };

  return (
    <div>
      {/* כותרת ראשית של הדף */}
      <div className="text-center">
        <h2>לקוחות</h2>
      </div>

      {/* כפתורי פעולות */}
      <div className="d-flex mb-3">
        {/* כפתור לפתיחת המודל */}
        <button
          className="btn btn-primary me-3"
          onClick={handleShowModal} // פתיחת חלון המודל
        >
          הוספת לקוח ורכב
        </button>

        {/* כפתור המדמה חיפוש */}
        <button
          className="btn btn-primary me-3"
          onClick={() => alert('חיפוש לפי ת"ז או שם')} // פעולה לדוגמה
        >
          חיפוש לפי ת"ז או שם
        </button>
      </div>

      {/* טבלת הלקוחות */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>שם לקוח</th>
            <th>ת"ז</th>
            <th>מספר טלפון</th>
            <th>מייל</th>
            <th>סטטוס לקוח</th>
            <th>מספר רישוי רכב</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {/* נתונים לדוגמה של לקוח */}
          <tr>
            <td>1</td>
            <td>יונתן לוי</td>
            <td>123456789</td>
            <td>050-123-4567</td>
            <td>yonatan@example.com</td>
            <td className="text-success">פעיל</td>
            <td>123-45-678</td>
            <td>
              {/* כפתור לעריכת פרטי הלקוח */}
              <button className="btn btn-primary btn-sm">עריכה</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* שימוש ברכיב המודל (חלון קופץ) */}
      <Modal isOpen={showModal} onClose={handleCloseModal} onSave={handleSave}>
        <h3>הוספת לקוח ורכב</h3> {/* כותרת המודל */}

        {/* טופס להוספת לקוח */}
        <form>
          <div className="form-group mb-3">
            <label>שם לקוח</label>
            <input
              type="text"
              placeholder="הזן שם לקוח"
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label>תעודת זהות</label>
            <input
              type="text"
              placeholder="הזן תעודת זהות"
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label>מספר טלפון</label>
            <input
              type="text"
              placeholder="הזן מספר טלפון"
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label>מייל</label>
            <input
              type="email"
              placeholder="הזן מייל"
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label>סטטוס לקוח</label>
            <select className="form-control">
              <option value="active">פעיל</option>
              <option value="inactive">לא פעיל</option>
            </select>
          </div>

          <div className="form-group mb-3">
            <label>מספר רישוי רכב</label>
            <input  
              type="text"
              placeholder="הזן תאריך"
              className="form-control"
            />
          </div>
        </form>
      </Modal>
    </div>      
  );
};

export default Customers;
