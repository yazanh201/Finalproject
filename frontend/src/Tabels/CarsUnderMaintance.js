import React, { useState } from "react";
import Modal from "./Modal"; // ייבוא רכיב המודל (Modal) להצגת חלון קופץ

/**
 * רכיב `CarsInService`
 * - מציג רשימת רכבים שנמצאים בטיפול.
 * - מאפשר הוספת רכב חדש לטיפול.
 * - מאפשר עריכת מידע על רכב בטיפול.
 */
const CarsInService = () => {
  // State לניהול הצגת מודלים (הוספה / עריכה)
  const [modalType, setModalType] = useState(null);

  /**
   * פונקציה לפתיחת מודל מתאים לפי סוג הפעולה
   * @param {string} type - סוג הפעולה ("add" - הוספה, "edit" - עריכה)
   */
  const handleShowModal = (type) => setModalType(type);

  /**
   * פונקציה לסגירת כל המודלים
   */
  const handleCloseModal = () => setModalType(null);

  /**
   * פונקציה לשמירת הנתונים החדשים
   * - מציגה הודעה שהתהליך הסתיים
   * - סוגרת את המודל לאחר שמירה
   */
  const handleSave = () => {
    alert("הרכב עודכן בהצלחה!");
    handleCloseModal();
  };

  return (
    <div>
      {/* כותרת ראשית */}
      <div className="text-center mb-4">
        <h2 className="me-3">רכבים בטיפול/תיקון</h2>
      </div>

      {/* כפתורי פעולות */}
      <div className="d-flex mb-3">
        {/* כפתור לפתיחת מודל הוספת רכב */}
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף רכב
        </button>
      </div>

      {/* טבלת רכבים בטיפול */}
      <div className="table-responsive">
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
            {/* רכב 1 */}
            <tr>
              <td>123-45-678</td>
              <td className="text-success">בטיפול</td>
              <td>07/01/2025</td>
              <td>10/01/2025</td>
              <td>5001</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit")}>
                  עריכה
                </button>
              </td>
            </tr>
            {/* רכב 2 */}
            <tr>
              <td>234-56-789</td>
              <td className="text-warning">ממתין לחלקים</td>
              <td>07/01/2025</td>
              <td>—</td> {/* תאריך יציאה לא ידוע */}
              <td>5002</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit")}>
                  עריכה
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* מודל הוספת רכב חדש */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת רכב לטיפול</h3>
          <form>
            <div className="form-group mb-3">
              <label>מספר רישוי</label>
              <input type="text" className="form-control" placeholder="הזן מספר רישוי" required />
            </div>

            <div className="form-group mb-3">
              <label>סטטוס טיפול</label>
              <select className="form-control">
                <option value="in_progress">בטיפול</option>
                <option value="waiting_parts">ממתין לחלקים</option>
                <option value="completed">הטיפול הסתיים</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>תאריך כניסה</label>
              <input type="date" className="form-control" required />
            </div>

            <div className="form-group mb-3">
              <label>תאריך יציאה</label>
              <input type="date" className="form-control" required />
            </div>

            <div className="form-group mb-3">
              <label>מזהה עובד</label>
              <input type="text" className="form-control" placeholder="הזן מזהה עובד" required />
            </div>
          </form>
        </Modal>
      )}

      {/* מודל עריכת רכב בטיפול */}
      {modalType === "edit" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת פרטי רכב בטיפול</h3>
          <form>
            <div className="form-group mb-3">
              <label>סטטוס טיפול</label>
              <select className="form-control">
                <option value="in_progress">בטיפול</option>
                <option value="waiting_parts">ממתין לחלקים</option>
                <option value="completed">הטיפול הסתיים</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>תאריך כניסה</label>
              <input type="date" className="form-control" required />
            </div>

            <div className="form-group mb-3">
              <label>תאריך יציאה</label>
              <input type="date" className="form-control" required />
            </div>

            <div className="form-group mb-3">
              <label>מזהה עובד</label>
              <input type="text" className="form-control" placeholder="הזן מזהה עובד" required />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CarsInService;
