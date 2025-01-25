import React from "react";

const CarsInService = () => (
  <div>
    {/* כותרת ראשית */}
    <div className="text-center mb-4">
      <h2>רכבים בטיפול/תיקון</h2>
    </div>

    {/* כפתורים */}
    <div className="d-flex mb-3">
      <button className="btn btn-primary me-3" onClick={() => alert("הוספת רכב חדש")}>
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
            <td>5001</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הרכב בטיפול")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* רכב 2 */}
          <tr>
            <td>234-56-789</td>
            <td className="text-warning">ממתין לחלקים</td>
            <td>07/01/2025</td>
            <td>5002</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הרכב בטיפול")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* רכב 3 */}
          <tr>
            <td>345-67-890</td>
            <td className="text-success">בטיפול</td>
            <td>08/01/2025</td>
            <td>5003</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הרכב בטיפול")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* רכב 4 */}
          <tr>
            <td>456-78-901</td>
            <td className="text-info">הטיפול הסתיים</td>
            <td>08/01/2025</td>
            <td>5004</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הרכב בטיפול")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* רכב 5 */}
          <tr>
            <td>567-89-012</td>
            <td className="text-warning">ממתין לאישור</td>
            <td>08/01/2025</td>
            <td>5005</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הרכב בטיפול")}
              >
                עריכה
              </button>
            </td>
          </tr>
          {/* רכב 6 */}
          <tr>
            <td>678-90-123</td>
            <td className="text-success">בטיפול</td>
            <td>09/01/2025</td>
            <td>5006</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הרכב בטיפול")}
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

export default CarsInService;
