import React from "react";

const Appointments = () => (
  <div>
    {/* כותרת ראשית */}
    <div className="text-center mb-4">
      <h2>תורים</h2>
    </div>

    {/* כפתורים */}
    <div className="d-flex mb-3">
      <button className="btn btn-primary me-3" onClick={() => alert("הוספת תור חדש")}>
        הוסף תור חדש
      </button>
      <button className="btn btn-primary me-3" onClick={() => alert("חיפוש תור לפי תעודת זהות")}>
        חיפוש לפי תעודת זהות
      </button>
      <button className="btn btn-primary me-3" onClick={() => alert("הצגת תורים לפי תאריך")}>
        בחירת תאריך להצגת תורים
      </button>
    </div>

    {/* טבלת התורים */}
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
          {/* נתוני תורים */}
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
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי התור")}>
                עריכה
              </button>
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
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי התור")}>
                עריכה
              </button>
            </td>
          </tr>
          <tr>
            <td>4003</td>
            <td>08/01/2025</td>
            <td>11:00</td>
            <td>יישור גלגלים</td>
            <td>456123789</td>
            <td>אבי מזרחי</td>
            <td>321-54-876</td>
            <td>3003</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי התור")}>
                עריכה
              </button>
            </td>
          </tr>
          <tr>
            <td>4004</td>
            <td>08/01/2025</td>
            <td>12:00</td>
            <td>החלפת צמיגים</td>
            <td>321654987</td>
            <td>נועה ישראלי</td>
            <td>654-32-109</td>
            <td>3004</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי התור")}>
                עריכה
              </button>
            </td>
          </tr>
          <tr>
            <td>4005</td>
            <td>08/01/2025</td>
            <td>13:00</td>
            <td>טיפול שנתי</td>
            <td>789123456</td>
            <td>דוד רפאל</td>
            <td>876-54-321</td>
            <td>3005</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי התור")}>
                עריכה
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default Appointments;
