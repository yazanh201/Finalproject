import React from "react";

const CarOrders = () => (
  <div>
    {/* כותרת ראשית */}
    <div className="text-center mb-4">
      <h2>הזמנות רכבים</h2>
    </div>

    {/* כפתורים */}
    <div className="d-flex  mb-3">
      <button className="btn btn-primary me-3" onClick={() => alert("הוספת הזמנה חדשה")}>
        הוסף הזמנה
      </button>
      <button className="btn btn-primary me-3" onClick={() => alert("חיפוש הזמנה לפי מספר רכב")}>
        חיפוש הזמנה לפי מספר רכב
      </button>
    </div>

    {/* טבלת הזמנות רכבים */}
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
          {/* הזמנה 1 */}
          <tr>
            <td>1001</td>
            <td>123-45-678</td>
            <td>01/01/2025</td>
            <td>05/01/2025</td>
            <td>בלמים, צמיגים</td>
            <td>2,500</td>
            <td className="text-success">התקבלה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי ההזמנה")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* הזמנה 2 */}
          <tr>
            <td>1002</td>
            <td>234-56-789</td>
            <td>02/01/2025</td>
            <td>07/01/2025</td>
            <td>פילטר שמן, שמן מנוע</td>
            <td>800</td>
            <td className="text-danger">לא התקבלה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי ההזמנה")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* הזמנה 3 */}
          <tr>
            <td>1003</td>
            <td>345-67-890</td>
            <td>03/01/2025</td>
            <td>09/01/2025</td>
            <td>פנס קדמי, מראה צד</td>
            <td>1,200</td>
            <td className="text-success">התקבלה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי ההזמנה")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* הזמנה 4 */}
          <tr>
            <td>1004</td>
            <td>456-78-901</td>
            <td>04/01/2025</td>
            <td>10/01/2025</td>
            <td>רצועת מנוע, מצבר</td>
            <td>1,800</td>
            <td className="text-danger">לא התקבלה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי ההזמנה")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* הזמנה 5 */}
          <tr>
            <td>1005</td>
            <td>567-89-012</td>
            <td>05/01/2025</td>
            <td>12/01/2025</td>
            <td>מערכת שמע</td>
            <td>3,000</td>
            <td className="text-success">התקבלה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי ההזמנה")}
              >
                עריכה
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default CarOrders;
