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
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mileage, setMileage] = useState('');


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

    if (type === 'add') {
      // איפוס שדות
      setvehicleNumber('');
      setOwner('');
      setOwnerID('');
      setBrand('');
      setModel('');
      setYear('');
      setColor('');
      setMileage('');

    }

    if (type === 'edit' && car) {
      // מילוי שדות לעריכה
      setvehicleNumber(car.vehicleNumber);
      setOwner(car.owner);
      setOwnerID(car.ownerID);
      setBrand(car.brand);
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
      if (!vehicleNumber.trim()) {
        alert('❌ חובה להזין מספר רכב!');
        return;
      }
  
      let carData;
  
      if (modalType === "edit" && selectedCar) {
        // בעריכה - שולחים שמות רגילים
        carData = {
          vehicleNumber,
          owner,
          ownerID,
          brand,
          model,
          year,
          color,
          mileage,
        };
        await axios.put(`http://localhost:5000/api/cars/${selectedCar._id}`, carData);
        alert("✅ פרטי הרכב עודכנו בהצלחה!");
      } else {
        // בהוספה - שולחים שמות תואמים למודל
        carData = {
          vehicleNumber: vehicleNumber,
          ownerName: owner,
          ownerIdNumber: ownerID,
          manufacturer: brand,
          model,
          year,
          color,
          mileage,
        };
        await axios.post('http://localhost:5000/api/cars', carData);
        alert("✅ רכב נוסף בהצלחה!");
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


  return (
    <div>
      <div className="text-center">
        <h2 className="me-3">רכבים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>הוסף רכב</button>
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
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car._id)}>מחיקה</button>
              </td>
            </tr>
          ))}
        </tbody>


      </table>


      {/* מודלים */}
      {(modalType === "add" || modalType === "edit") && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
        <h3>{modalType === "edit" ? "עריכת רכב" : "הוספת רכב חדש"}</h3>
        <form>
          <div className="form-group mb-3">
            <label>מספר רכב</label>
            <input
              type="text"
              className="form-control"
              value={vehicleNumber || ''}
              onChange={(e) => setvehicleNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>שם בעל הרכב</label>
            <input
              type="text"
              className="form-control"
              value={owner || ''}
              onChange={(e) => setOwner(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>תעודת זהות</label>
            <input
              type="text"
              className="form-control"
              value={ownerID || ''}
              onChange={(e) => setOwnerID(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>יצרן</label>
            <input
              type="text"
              className="form-control"
              value={brand || ''}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
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