import React from "react";

const Inquiries = () => (
  <div>
    {/* כותרת הדף */}
    <div className="text-center mb-4">
      <h2>פניות</h2>
    </div>

    {/* כפתור חיפוש */}
    <div className="d-flex mb-3">
      <button
        className="btn btn-primary"
        onClick={() => alert(" חיפוש לפי מספר טלפון")}
      >
        חיפוש לפי מספר טלפון או שם
      </button>
      <button
        className="btn btn-primary me-3"
        onClick={() => alert("הוספת לקוח חדש")}
      >
        הוספת פנייה
      </button>
    </div>

    {/* טבלת הפניות */}
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>מספר פנייה</th>
            <th>שם לקוח</th>
            <th>מייל</th>
            <th>מספר טלפון</th>
            <th>תאריך פנייה</th>
            <th>תיאור פנייה</th>
            <th>סטטוס פנייה</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {/* פנייה 1 */}
          <tr>
            <td>1</td>
            <td>001</td>
            <td>יונתן לוי</td>
            <td>yonatan.levi@example.com</td>
            <td>050-1234567</td>
            <td>07/01/2025</td>
            <td>רעש במנוע</td>
            <td className="text-success">פתוחה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הפנייה")}
              >
                עדכון
              </button>
            </td>
          </tr>
          {/* פנייה 2 */}
          <tr>
            <td>2</td>
            <td>002</td>
            <td>שרה כהן</td>
            <td>sara.kohen@example.com</td>
            <td>052-9876543</td>
            <td>07/01/2025</td>
            <td>החלפת שמן</td>
            <td className="text-success">פתוחה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הפנייה")}
              >
                עדכון
              </button>
            </td>
          </tr>
          {/* פנייה 3 */}
          <tr>
            <td>3</td>
            <td>003</td>
            <td>אבי מזרחי</td>
            <td>avi.mizrahi@example.com</td>
            <td>054-8765432</td>
            <td>07/01/2025</td>
            <td>בדיקת בלמים</td>
            <td className="text-danger">סגורה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הפנייה")}
              >
                עדכון
              </button>
            </td>
          </tr>
          {/* פנייה 4 */}
          <tr>
            <td>4</td>
            <td>004</td>
            <td>נועה ישראלי</td>
            <td>noa.israeli@example.com</td>
            <td>053-5678901</td>
            <td>08/01/2025</td>
            <td>טיפול שנתי</td>
            <td className="text-success">פתוחה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הפנייה")}
              >
                עדכון
              </button>
            </td>
          </tr>
          {/* פנייה 5 */}
          <tr>
            <td>5</td>
            <td>005</td>
            <td>דוד רפאל</td>
            <td>david.rafael@example.com</td>
            <td>052-4567890</td>
            <td>08/01/2025</td>
            <td>החלפת מצבר</td>
            <td className="text-success">פתוחה</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert("עריכת פרטי הפנייה")}
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

export default Inquiries;
