import React, { useState } from "react";
import Modal from "./Modal"; // רכיב ה-Modal להצגת חלון קופץ

/**
 * רכיב `CarOrders`
 * - מציג טבלת הזמנות רכבים עם אפשרות הוספה, חיפוש ועריכה.
 */
const CarOrders = () => {
  // סטייט לניהול הצגת מודלים
  const [modalType, setModalType] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // שמירת הנתונים של הזמנה שנבחרה לעריכה

  // נתוני הזמנות לדוגמה
  const orders = [
    { id: 1001, carNumber: "123-45-678", orderDate: "2025-01-01", deliveryDate: "2025-01-05", details: "בלמים, צמיגים", cost: 2500, status: "התקבלה" },
    { id: 1002, carNumber: "234-56-789", orderDate: "2025-02-15", deliveryDate: "2025-02-20", details: "פילטר שמן, שמן מנוע", cost: 800, status: "בטיפול" }
  ];

  /**
   * פונקציה לפתיחת מודל
   * @param {string} type - סוג הפעולה (add, search, edit)
   * @param {Object} [order] - אובייקט הזמנה במידה ומדובר בעריכה
   */
  const handleShowModal = (type, order = null) => {
    setModalType(type);
    if (order) setSelectedOrder(order);
  };

  // פונקציה לסגירת המודל
  const handleCloseModal = () => {
    setModalType(null);
    setSelectedOrder(null);
  };

  // פונקציה המדמה שמירת נתונים
  const handleSave = () => {
    alert("הפעולה בוצעה בהצלחה!");
    handleCloseModal();
  };


  const orderStatuses = ["התקבלה", "בטיפול", "הושלמה", "בוטלה"];

  return (
    <div>
      {/* כותרת ראשית */}
      <div className="text-center mb-4">
        <h2 className="me-3" >הזמנות רכבים</h2>
      </div>

      {/* כפתורים לניהול ההזמנות */}
      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף הזמנה
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>
          חיפוש הזמנה לפי מספר רכב
        </button>
      </div>

      {/* טבלת הזמנות */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>מזהה הזמנה</th>
              <th>מספר רכב</th>
              <th>תאריך הזמנה</th>
              <th>תאריך אספקה</th>
              <th>פרטי הזמנה</th>
              <th>עלות (ש"ח)</th>
              <th>סטטוס הזמנה</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.carNumber}</td>
                <td>{order.orderDate}</td>
                <td>{order.deliveryDate}</td>
                <td>{order.details}</td>
                <td>{order.cost}</td>
                <td className={order.status === "התקבלה" ? "text-success" : "text-warning"}>
                  {order.status}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", order)}>
                    עריכה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === מודלים לפי `modalType` === */}

      {/* מודל להוספת הזמנה חדשה */}
      {modalType === "add" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>הוספת הזמנה חדשה</h3>
          <form>
            <div className="form-group mb-3">
              <label>מספר רכב</label>
              <input type="text" className="form-control" placeholder="הזן מספר רכב" required />
            </div>
            <div className="form-group mb-3">
              <label>תאריך הזמנה</label>
              <input type="date" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>תאריך אספקה</label>
              <input type="date" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>פרטי הזמנה</label>
              <textarea className="form-control" placeholder="פרטי ההזמנה" required />
            </div>
            <div className="form-group mb-3">
              <label>עלות (ש"ח)</label>
              <input type="number" className="form-control" placeholder="הזן עלות" required />
            </div>
          </form>
        </Modal>
      )}

      {/* מודל חיפוש לפי מספר רכב */}
      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <h3>חיפוש הזמנה</h3>
          <div className="form-group mb-3">
            <label>הזן מספר רכב</label>
            <input type="text" className="form-control" placeholder="חיפוש לפי מספר רכב" required />
          </div>
        </Modal>
      )}

      {/* מודל עריכת הזמנה */}
      {modalType === "edit" && selectedOrder && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת הזמנה #{selectedOrder.id}</h3>
          <form>
            <div className="form-group mb-3">
              <label>מספר רכב</label>
              <input type="text" className="form-control" defaultValue={selectedOrder.carNumber} required />
            </div>
            <div className="form-group mb-3">
              <label>תאריך הזמנה</label>
              <input type="date" className="form-control" defaultValue={selectedOrder.orderDate} required />
            </div>
            <div className="form-group mb-3">
              <label>תאריך אספקה</label>
              <input type="date" className="form-control" defaultValue={selectedOrder.deliveryDate} required />
            </div>
            <div className="form-group mb-3">
              <label>פרטי הזמנה</label>
              <textarea className="form-control" defaultValue={selectedOrder.details} required />
            </div>
            <div className="form-group mb-3">
              <label>עלות (ש"ח)</label>
              <input type="number" className="form-control" defaultValue={selectedOrder.cost} required />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס הזמנה</label>
              <select className="form-control" defaultValue={selectedOrder.status} required>
                {orderStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CarOrders;
