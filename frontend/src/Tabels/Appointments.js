import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב ה-Modal לשימוש בהצגת חלון קופץ

const Appointments = () => {
  // משתנה מצב לניהול הצגת החלון הקופץ
  const [showModal, setShowModal] = useState(false);
  
  // פונקציה לפתיחת החלון הקופץ
  const handleShowModal = () => setShowModal(true);
  
  // פונקציה לסגירת החלון הקופץ
  const handleCloseModal = () => setShowModal(false);
  
  // פונקציה לשמירת התור והצגת הודעה
  const handleSave = () => {
    alert("תור נשמר בהצלחה!"); // הצגת הודעה למשתמש לאחר שמירת התור
    handleCloseModal(); // סגירת החלון לאחר השמירה
  };

  return (
    <div>
      {/* כותרת ראשית */}
      <div className="text-center mb-4">
        <h2>תורים</h2>
      </div>

      {/* כפתורים לניהול התורים */}
      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={handleShowModal}>
          הוסף תור חדש
        </button>
        <button className="btn btn-primary me-3" onClick={() => alert("חיפוש תור לפי תעודת זהות")}>
          חיפוש לפי תעודת זהות
        </button>
        <button className="btn btn-primary me-3" onClick={() => alert("הצגת תורים לפי תאריך")}>
          בחירת תאריך להצגת תורים
        </button>
      </div>

      {/* טבלת הצגת התורים */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מזהה תור</th>
              <th>תאריך</th>
              <th>שעה</th>
              <th>תיאור</th>
              <th>תעודת זהות</th>
              <th>שם לקוח</th>
              <th>מספר רישוי רכב</th>
              <th>מזהה טיפול</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {/* נתוני תורים מדומים להצגה בטבלה */}
            <tr>
              <td>4001</td>
              <td>08/01/2025</td>
              <td>09:00</td>
              <td>החלפת שמן מנוע</td>
              <td>123456789</td>
              <td>יונתן לוי</td>
              <td>123-45-678</td>
              <td>3001</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי התור")}>עריכה</button>
              </td>
            </tr>
            <tr>
              <td>4002</td>
              <td>08/01/2025</td>
              <td>10:00</td>
              <td>בדיקת מערכת בלמים</td>
              <td>987654321</td>
              <td>שרה כהן</td>
              <td>987-65-432</td>
              <td>3002</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי התור")}>עריכה</button>
              </td>
            </tr>
            {/* ניתן להוסיף שורות נוספות */}
          </tbody>
        </table>

        {/* חלון קופץ להוספת תור חדש */}
  {/* חלון קופץ להוספת תור חדש */}
  <Modal isOpen={showModal} onClose={handleCloseModal} onSave={handleSave}>
        <h3>הוספת תור חדש</h3>
        <form onSubmit={handleSave}>
          <div className="form-group mb-3">
            <label>תאריך</label>
            <input type="date" className="form-control" required />
          </div>

          <div className="form-group mb-3">
            <label>שעה</label>
            <input type="time" className="form-control" required />
          </div>

          <div className="form-group mb-3">
            <label>תיאור</label>
            <input type="text" className="form-control" placeholder="תיאור הטיפול" required />
          </div>

          <div className="form-group mb-3">
            <label>תעודת זהות</label>
            <input type="text" className="form-control" placeholder="הזן תעודת זהות" required />
          </div>

          <div className="form-group mb-3">
            <label>שם לקוח</label>
            <input type="text" className="form-control" placeholder="הזן שם לקוח" required />
          </div>

          <div className="form-group mb-3">
            <label>מספר רישוי רכב</label>
            <input type="text" className="form-control" placeholder="הזן מספר רישוי" required />
          </div>

          {/* כפתורים */}
          <div className="modal-buttons">

          </div>
        </form>
      </Modal>
      </div>
    </div>
  );
};

export default Appointments;
