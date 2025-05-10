import React, { useState, useEffect } from "react";
import Modal from "./Modal"; 
import axios from "axios";  

const Customers = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  
  // סטייטים לטופס
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('פעיל');
  const [vehicleNumber, setvehicleNumber] = useState('');
  
  // סטייט לשדה חיפוש
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  // שליפת כל הלקוחות
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('❌ שגיאה בשליפת לקוחות:', error.message);
    }
  };

  const handleShowModal = (type, customer = null) => {
    setModalType(type);
    setSelectedCustomer(customer);

    if (type === 'add') {
      // איפוס שדות להוספה
      setName('');
      setIdNumber('');
      setPhone('');
      setEmail('');
      setStatus('פעיל');
      setvehicleNumber('');
    }

    if (type === 'edit' && customer) {
      // מילוי נתונים קיימים לעריכה
      setName(customer.name);
      setIdNumber(customer.idNumber);
      setPhone(customer.phone);
      setEmail(customer.email);
      setStatus(customer.status);
      setvehicleNumber(customer.vehicles && customer.vehicles.length > 0 ? customer.vehicles[0] : '');
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedCustomer(null);
  };

  // הוספה או עדכון לקוח
  const handleSave = async () => {
    try {
      const customerData = {
        name,
        idNumber,
        phone,
        email,
        status,
        vehicleNumber: [vehicleNumber],
      };

      if (modalType === "edit" && selectedCustomer) {
        // עריכת לקוח קיים
        await axios.put(`http://localhost:5000/api/customers/${selectedCustomer._id}`, customerData);
        alert("✅ פרטי הלקוח עודכנו בהצלחה!");
      } else {
        // הוספת לקוח חדש
        await axios.post('http://localhost:5000/api/customers', customerData);
        alert("✅ לקוח נוסף בהצלחה!");
      }

      handleCloseModal();
      fetchCustomers(); // רענון טבלה אחרי כל פעולה

    } catch (error) {
      console.error('❌ שגיאה בשמירה:', error.message);
      alert('❌ שגיאה בשמירה');
    }
  };

  // פונקציה לחיפוש לקוח לפי ת"ז או שם
  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        fetchCustomers();
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/customers/search?query=${searchQuery}`);
      setCustomers(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('❌ שגיאה בחיפוש:', error.message);
      alert('❌ שגיאה בחיפוש');
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="me-3">לקוחות</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("add")}>
          הוסף לקוח חדש
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("searchID")}>
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
            <th>סטטוס</th>
            <th>מספר רישוי רכב</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer._id}>
              <td>{index + 1}</td>
              <td>{customer.name || '-'}</td>
              <td>{customer.idNumber || '-'}</td>
              <td>{customer.phone || '-'}</td>
              <td>{customer.email || '-'}</td>
              <td className={customer.status === "פעיל" ? "text-success" : "text-danger"}>
                {customer.status || '-'}
              </td>
              <td>
                {customer.vehicles && customer.vehicles.length > 0 ? customer.vehicles[0] : '-'}
              </td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleShowModal("edit", customer)}>
                  עריכה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* מודלים */}
      {(modalType === "add" || modalType === "edit") && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>{modalType === "edit" ? "עריכת לקוח" : "הוספת לקוח ורכב"}</h3>
          <form>
            <div className="form-group mb-3">
              <label>שם לקוח</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input
                type="text"
                className="form-control"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>מייל</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>סטטוס</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="פעיל">פעיל</option>
                <option value="לא פעיל">לא פעיל</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>מספר רישוי רכב</label>
              <input
                type="text"
                className="form-control"
                value={vehicleNumber}
                onChange={(e) => setvehicleNumber(e.target.value)}
                required
              />
            </div>
          </form>

        </Modal>
      )}

      {modalType === "searchID" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSearch}>
          <h3>חיפוש לקוח לפי תעודת זהות או שם</h3>
          <div className="form-group mb-3">
            <label>הזן ת"ז / שם</label>
            <input
              type="text"
              className="form-control"
              placeholder="תעודת זהות / שם"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Customers;
