import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";

const CarsTable = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);

  // סטייטים לשדות רכב
  const [vehicleNumber, setvehicleNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [ownerID, setOwnerID] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mileage, setMileage] = useState('');
  const [maker, setMaker] = useState('');



  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    } catch (error) {
      console.error('❌ שגיאה בשליפת רכבים:', error.message);
    }
  };

  const handleShowModal = (type, car = null) => {
    setModalType(type);
    setSelectedCar(car);

    if (type === 'edit' && car) {
    setvehicleNumber(car.vehicleNumber);
    setOwner(car.ownerName);
    setOwnerID(car.ownerIdNumber);
    setMaker(car.manufacturer || ''); // ✅ שורה קריטית
    setModel(car.model);
    setYear(car.year);
    setColor(car.color);
    setMileage(car.mileage || '');
  }

  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedCar(null);
  };

  const handleSave = async () => {
  try {
    const currentYear = new Date().getFullYear();

    // ✅ אימות מספר רכב
    if (!vehicleNumber.trim()) {
      alert("❌ חובה להזין מספר רכב!");
      return;
    }

    // ✅ אימות שם בעלים
    if (modalType === "add" && !owner.trim()) {
      alert("❌ חובה להזין שם בעל הרכב!");
      return;
    }

    // ✅ אימות תעודת זהות
    if (modalType === "add" && (!ownerID || !/^\d{9}$/.test(ownerID))) {
      alert("❌ תעודת זהות חייבת להכיל בדיוק 9 ספרות");
      return;
    }

    // ✅ אימות יצרן (brand)
    if (!maker || maker.trim().length < 2) {
      alert("❌ יש לבחור יצרן רכב");
      return;
    }

    // ✅ אימות דגם
    if (!model || model.trim().length < 1) {
      alert("❌ חובה להזין דגם הרכב");
      return;
    }

    // ✅ אימות שנת ייצור
    if (!year || isNaN(year) || year < 1950 || year > currentYear) {
      alert(`❌ שנת ייצור לא חוקית. יש להזין שנה בין 1950 ל-${currentYear}`);
      return;
    }

    // ✅ אימות צבע (רשות – אפשר לשפר בעתיד)
    if (!color || color.trim().length < 2) {
      alert("❌ חובה להזין צבע הרכב");
      return;
    }

    // ✅ אימות קילומטראז'
    if (!mileage || isNaN(mileage) || mileage < 0) {
      alert("❌ קילומטראז' חייב להיות מספר חיובי בלבד");
      return;
    }

    let carData;

    if (modalType === "edit" && selectedCar) {
      // ✏️ בעריכה - שמות שדות פשוטים
      carData = {
        vehicleNumber,
        owner,
        ownerID,
        manufacturer: maker,
        model,
        year,
        color,
        mileage,
      };

      await axios.put(`http://localhost:5000/api/cars/${selectedCar._id}`, carData);
      alert("✅ פרטי הרכב עודכנו בהצלחה!");

    } else {
      alert("❌ לא ניתן להוסיף רכב בדף זה.");
      return;
}


    handleCloseModal();
    fetchCars();

  } catch (error) {
    console.error('❌ שגיאה בשמירה:', error.message);
    alert('❌ שגיאה בשמירה');
  }
};

  
  

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        fetchCars();
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/cars/search?query=${searchQuery}`);
      setCars(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('❌ שגיאה בחיפוש:', error.message);
      alert('❌ שגיאה בחיפוש');
    }
  };

  const carMakers = [
  "טויוטה", "יונדאי", "קיה", "מאזדה", "פורד", "סובארו", "שברולט",
  "פיאט", "אאודי", "ב.מ.וו", "מרצדס", "וולוו", "פיג'ו", "סיטרואן",
  "סקודה", "ניסאן", "רנו", "הונדה", "לקסוס"
];

const handleDelete = async (id) => {
  if (!window.confirm("האם אתה בטוח שברצונך למחוק את הרכב הזה?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/cars/${id}`);
    alert("✅ הרכב נמחק בהצלחה!");
    fetchCars(); // רענון הטבלה אחרי המחיקה
  } catch (error) {
    console.error("❌ שגיאה במחיקת רכב:", error);
    alert(error.response?.data?.message || "❌ שגיאה במחיקת רכב");
  }
};




  return (
    <div>
      <div className="text-center">
        <h2 className="me-3">רכבים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("search")}>חיפוש לפי מספר רכב או ת.ז</button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>מספר רכב</th>
            <th>שם בעל הרכב</th>
            <th>תעודת זהות</th>
            <th>יצרן</th>
            <th>דגם</th>
            <th>שנת ייצור</th>
            <th>צבע</th>
            <th>קילומטראז'</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr key={car._id}>
              <td>{index + 1}</td>
              <td>{car.vehicleNumber || '-'}</td>
              <td>{car.ownerName || '-'}</td>
              <td>{car.ownerIdNumber || '-'}</td>
              <td>{car.manufacturer || '-'}</td>
              <td>{car.model || '-'}</td>
              <td>{car.year || '-'}</td>
              <td>{car.color || '-'}</td>
              <td>{car.mileage !== undefined ? `${car.mileage} ק"מ` : '-'}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleShowModal("edit", car)}>עריכה</button>
                <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(car._id)}>מחיקה</button>
              </td>
            </tr>
          ))}
        </tbody>


      </table>


      {/* מודלים */}
      {modalType === "edit" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
        <h3>{modalType === "edit" ? "עריכת רכב" : "הוספת רכב חדש"}</h3>
        <form>

          <div className="form-group mb-3">
            <label>יצרן</label>
            <select
              className="form-control"
              value={maker}
              onChange={(e) => setMaker(e.target.value)}
              required
            >
              <option value="">בחר יצרן</option>
              {carMakers.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label>דגם</label>
            <input
              type="text"
              className="form-control"
              value={model || ''}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>שנת ייצור</label>
            <input
              type="number"
              className="form-control"
              value={year || ''}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>צבע</label>
            <input
              type="text"
              className="form-control"
              value={color || ''}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>קילומטראז'</label>
            <input
              type="number"
              className="form-control"
              value={mileage || ''}
              onChange={(e) => setMileage(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
      
      )}

      {modalType === "search" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSearch}>
          <h3>חיפוש רכב</h3>
          <div className="form-group mb-3">
            <label>מספר רכב או תעודת זהות</label>
            <input type="text" className="form-control" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} required />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CarsTable;