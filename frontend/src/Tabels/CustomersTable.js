import React from "react";

/**
 * רכיב Customers - מציג טבלת לקוחות עם נתונים ודוגמאות.
 * כולל כפתורים להוספת לקוח ולחיפוש לפי שם או תעודת זהות.
 */
const Customers = () => (
  <div>
    {/* כותרת ראשית של הדף */}
    <div className="text-center">
      <h2>לקוחות</h2>
    </div>

    {/* כפתורים להוספת לקוח ולחיפוש */}
    <div className="d-flex mb-3">
      <button
        className="btn btn-primary me-3"
        onClick={() => alert("הוספת לקוח חדש")}
      >
        הוספת לקוח
      </button>
      <button
        className="btn btn-primary me-3"
        onClick={() => alert("חיפוש לפי ת\"ז או שם")}
      >
        חיפוש לפי ת"ז או שם
      </button>
    </div>

    {/* טבלת הלקוחות */}
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>שם לקוח</th>
          <th>ת"ז</th>
          <th>מספר טלפון</th>
          <th>מייל</th>
          <th>סטטוס לקוח</th>
          <th>מספר רישוי רכב</th>
          <th>פעולה</th>
        </tr>
      </thead>
      <tbody>
        {/* לקוח 1 */}
        <tr>
          <td>1</td>
          <td>יונתן לוי</td>
          <td>123456789</td>
          <td>050-123-4567</td>
          <td>yonatan@example.com</td>
          <td className="text-success">פעיל</td>
          <td>123-45-678</td>
          <td>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert("עריכת פרטי הלקוח")}
            >
              עריכה
            </button>
          </td>
        </tr>

        {/* לקוח 2 */}
        <tr>
          <td>2</td>
          <td>שרה כהן</td>
          <td>987654321</td>
          <td>052-987-6543</td>
          <td>sara@example.com</td>
          <td className="text-success">פעיל</td>
          <td>987-65-432</td>
          <td>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert("עריכת פרטי הלקוח")}
            >
              עריכה
            </button>
          </td>
        </tr>

        {/* לקוח 3 */}
        <tr>
          <td>3</td>
          <td>אבי מזרחי</td>
          <td>456123789</td>
          <td>054-456-1234</td>
          <td>avi@example.com</td>
          <td className="text-danger">לא פעיל</td>
          <td>321-54-876</td>
          <td>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert("עריכת פרטי הלקוח")}
            >
              עריכה
            </button>
          </td>
        </tr>

        {/* לקוח 4 */}
        <tr>
          <td>4</td>
          <td>נועה ישראלי</td>
          <td>321654987</td>
          <td>053-321-6549</td>
          <td>noa@example.com</td>
          <td className="text-success">פעיל</td>
          <td>654-32-109</td>
          <td>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert("עריכת פרטי הלקוח")}
            >
              עריכה
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Customers;
