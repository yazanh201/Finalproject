import React from "react";

const CarsTable = () => (

  <div>
    <div className="text-center">
        <h2>רכבים</h2 >
    </div>
    <div className="d-flex  mb-3">
      <button className="btn btn-primary me-3" onClick={() => alert("הוספת רכב חדש")}>
          הוסף רכב
      </button>
      <button className="btn btn-primary me-4" onClick={() => alert("חיפוש לפי מספר רכב או תעודת זהות")}>
          חפש לפי מספר רכב או ת.ז
      </button>
    </div>

    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>מספר רכב</th>
          <th>שם בעל הרכב</th>
          <th>תעודת זהות בעל הרכב</th>
          <th>יצרן</th>
          <th>דגם</th>
          <th>שנת ייצור</th>
          <th>צבע</th>
          <th>סטטוס</th>
          <th>פעולה</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>123-45-678</td>
          <td>יונתן לוי</td>
          <td>123456789</td>
          <td>טויוטה</td>
          <td>קורולה</td>
          <td>2020</td>
          <td>לבן</td>
          <td className="text-success">פעיל</td>
          <td>
            <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי הרכב")}>
              עריכה
            </button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>987-65-432</td>
          <td>שרה כהן</td>
          <td>987654321</td>
          <td>פורד</td>
          <td>טרנזיט</td>
          <td>2018</td>
          <td>כחול</td>
          <td className="text-success">פעיל</td>
          <td>
            <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי הרכב")}>
              עריכה
            </button>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>321-54-876</td>
          <td>אבי מזרחי</td>
          <td>456123789</td>
          <td>ג'יפ</td>
          <td>רנגלר</td>
          <td>2022</td>
          <td>שחור</td>
          <td className="text-danger">לא פעיל</td>
          <td>
            <button className="btn btn-primary btn-sm" onClick={() => alert("עריכת פרטי הרכב")}>
              עריכה
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default CarsTable;
