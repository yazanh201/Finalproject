import React from "react";

const TreatmentsTable = () => (
  <div>
    {/* כותרת הטבלה */}
    <div className="text-center mb-4">
      <h2>טיפולים</h2>
    </div>

    {/* כפתורים להוספת טיפולים וחיפושים */}
    <div className="d-flex mb-3 gap-2">
      <button
        className="btn btn-primary"
        onClick={() => alert("בחר תאריך להצגת טיפולים")}
      >
        בחירת תאריך להצגת טיפולים
      </button>
      <button
        className="btn btn-primary"
        onClick={() => alert("חיפוש טיפולים לפי מספר רכב")}
      >
        חיפוש טיפולים לפי מספר רכב
      </button>
      <button
        className="btn btn-primary"
        onClick={() => alert("הוספת טיפול חדש")}
      >
        הוספת טיפול
      </button>
    </div>

    {/* הטבלה */}
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>מזהה טיפול</th>
            <th>תאריך</th>
            <th>עלות (ש"ח)</th>
            <th>מזהה עובד</th>
            <th>מזהה סוג טיפול</th>
            <th>מספר רישוי רכב</th>
            <th>מזהה תור</th>
            <th>מזהה חשבונית</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {/* שורה 1 */}
          <tr>
            <td>3001</td>
            <td>08/01/2025</td>
            <td>800</td>
            <td>5001</td>
            <td>6001</td>
            <td>123-45-678</td>
            <td>4001</td>
            <td>7001</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הטיפול")}
              >
                עדכון
              </button>
            </td>
          </tr>
          {/* שורה 2 */}
          <tr>
            <td>3002</td>
            <td>07/01/2025</td>
            <td>1200</td>
            <td>5002</td>
            <td>6002</td>
            <td>987-65-432</td>
            <td>4002</td>
            <td>7002</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הטיפול")}
              >
                עדכון
              </button>
            </td>
          </tr>
          {/* שורה 3 */}
          <tr>
            <td>3003</td>
            <td>09/01/2025</td>
            <td>600</td>
            <td>5003</td>
            <td>6003</td>
            <td>321-54-876</td>
            <td>4003</td>
            <td>7003</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הטיפול")}
              >
                עדכון
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default TreatmentsTable;
