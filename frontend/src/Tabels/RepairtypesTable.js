import React from "react";

const TreatmentTypes = () => (
  <div>
    {/* כותרת ראשית */}
    <div className="text-center mb-4">
      <h2>סוגי טיפולים/תיקונים</h2>
    </div>

    {/* כפתורים */}
    <div className="d-flex  mb-3">
      <button className="btn btn-primary me-3" onClick={() => alert("הוספת סוג טיפול חדש")}>
        הוסף סוג טיפול חדש
      </button>
      <button className="btn btn-primary me-3" onClick={() => alert("חיפוש סוג טיפול")}>
        חיפוש סוג טיפול
      </button>
    </div>

    {/* טבלת סוגי טיפולים */}
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>מזהה טיפול/תיקון</th>
            <th>שם סוג טיפול</th>
            <th>תיאור</th>
            <th>מזהה טיפול</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {/* סוג טיפול 1 */}
          <tr>
            <td>6001</td>
            <td>החלפת שמן</td>
            <td>החלפת שמן מנוע ופילטרים לשמירה על ביצועי הרכב.</td>
            <td>3001</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת סוג טיפול")}>
                עריכה
              </button>
            </td>
          </tr>
          {/* סוג טיפול 2 */}
          <tr>
            <td>6002</td>
            <td>תיקון בלמים</td>
            <td>בדיקה והחלפה של רפידות בלמים ודיסקים.</td>
            <td>3002</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת סוג טיפול")}>
                עריכה
              </button>
            </td>
          </tr>
          {/* סוג טיפול 3 */}
          <tr>
            <td>6003</td>
            <td>יישור גלגלים</td>
            <td>כוונון זווית הגלגלים לשיפור היציבות ובטיחות הנהיגה.</td>
            <td>3003</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת סוג טיפול")}>
                עריכה
              </button>
            </td>
          </tr>
          {/* סוג טיפול 4 */}
          <tr>
            <td>6004</td>
            <td>בדיקת מערכת חשמל</td>
            <td>בדיקה כוללת לאיתור תקלות במערכת החשמל של הרכב.</td>
            <td>3004</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת סוג טיפול")}>
                עריכה
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default TreatmentTypes;
