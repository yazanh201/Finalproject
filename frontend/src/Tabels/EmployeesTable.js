import React from "react";

const Employees = () => (
  <div>
    {/* כותרת ראשית */}
    <div className="text-center mb-4">
      <h2>עובדים</h2>
    </div>

    {/* כפתורים */}
    <div className="d-flex  mb-3">
      <button className="btn btn-primary me-3" onClick={() => alert("הוספת עובד חדש")}>
        הוסף עובד חדש
      </button>
      <button className="btn btn-primary me-3" onClick={() => alert("חיפוש עובד לפי ת\"ז או שם")}>
        חיפוש לפי תעודת זהות או שם
      </button>
    </div>

    {/* טבלת העובדים */}
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>מזהה עובד</th>
            <th>תעודת זהות</th>
            <th>שם מלא</th>
            <th>תפקיד</th>
            <th>אימייל</th>
            <th>מספר טלפון</th>
            <th>סטטוס</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {/* עובד 1 */}
          <tr>
            <td>5001</td>
            <td>123456789</td>
            <td>יוסי כהן</td>
            <td>מכונאי</td>
            <td>yossi@example.com</td>
            <td>050-123-4567</td>
            <td className="text-success">פעיל</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי העובד")}>
                עריכה
              </button>
            </td>
          </tr>
          {/* עובד 2 */}
          <tr>
            <td>5002</td>
            <td>987654321</td>
            <td>דנה לוי</td>
            <td>מנהלת משרד</td>
            <td>dana@example.com</td>
            <td>052-987-6543</td>
            <td className="text-success">פעיל</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי העובד")}>
                עריכה
              </button>
            </td>
          </tr>
          {/* עובד 3 */}
          <tr>
            <td>5003</td>
            <td>456123789</td>
            <td>אבי מזרחי</td>
            <td>מכונאי</td>
            <td>avi@example.com</td>
            <td>054-456-1234</td>
            <td className="text-danger">לא פעיל</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי העובד")}>
                עריכה
              </button>
            </td>
          </tr>
          {/* עובד 4 */}
          <tr>
            <td>5004</td>
            <td>321654987</td>
            <td>נועה ישראלי</td>
            <td>מתאמת שירות</td>
            <td>noa@example.com</td>
            <td>053-321-6549</td>
            <td className="text-success">פעיל</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי העובד")}>
                עריכה
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default Employees;
