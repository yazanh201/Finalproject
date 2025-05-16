import React, { useState, useEffect } from "react";
import Modal from "./Modal"; 
import axios from "axios";  
import { useNavigate } from "react-router-dom";


const Customers = () => {
  const navigate = useNavigate();
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

const [phonePrefix, setPhonePrefix] = useState('052');
const [phoneSuffix, setPhoneSuffix] = useState('');

  
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
      setName(customer.name);
      setIdNumber(customer.idNumber);

      const fullPhone = customer.phone || '';
      if (fullPhone.length === 10) {
        setPhonePrefix(fullPhone.substring(0, 3));
        setPhoneSuffix(fullPhone.substring(3));
      } else {
        setPhonePrefix('');
        setPhoneSuffix('');
      }

      setEmail(customer.email);
      setStatus(customer.status);
      setvehicleNumber(customer.vehicles?.[0] || '');
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedCustomer(null);
  };

  // הוספה או עדכון לקוח
  const handleSave = async () => {
  try {
    // אימותים
    const idRegex = /^\d{9}$/;
    const carRegex = /^\d{1,9}$/;
    const nameRegex = /^[\u0590-\u05FFa-zA-Z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!nameRegex.test(name)) {
      alert("❌ שם לקוח חייב להכיל לפחות 2 אותיות, ללא מספרים");
      return;
    }

    if (!idRegex.test(idNumber)) {
      alert("❌ תעודת זהות חייבת להכיל בדיוק 9 ספרות");
      return;
    }

    if (!carRegex.test(vehicleNumber)) {
      alert("❌ מספר רכב חייב להכיל עד 9 ספרות בלבד");
      return;
    }

    if (email && !emailRegex.test(email)) {
      alert("❌ כתובת מייל אינה תקינה");
      return;
    }

    const fullPhone = phonePrefix + phoneSuffix;
    const phoneRegex = /^05[0-9]{8}$/;

    if (!phoneRegex.test(fullPhone)) {
      alert("❌ מספר טלפון לא תקין. יש להזין קידומת חוקית ו-7 ספרות.");
      return;
    }
    const customerData = {
      name,
      idNumber,
      phone: fullPhone, // ✅ עכשיו זה נשלח כמו שצריך
      email,
      status,
      vehicleNumber: [vehicleNumber],
    };

    if (modalType === "edit" && selectedCustomer) {
      await axios.put(`http://localhost:5000/api/customers/${selectedCustomer._id}`, customerData);
      alert("✅ פרטי הלקוח עודכנו בהצלחה!");
    } else {
      await axios.post('http://localhost:5000/api/customers', customerData);
      alert("✅ לקוח נוסף בהצלחה!");
    }

    handleCloseModal();
    fetchCustomers();

  } catch (error) {
  console.error('❌ שגיאה בשמירה:', error.message);

  if (error.response && error.response.status === 400) {
    alert(error.response.data.message); // יציג את ההודעה הברורה
  } else {
    alert('❌ שגיאה בשמירה');
  }
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



    const handleAddCar = async () => {
    try {
      if (!vehicleNumber || vehicleNumber.length < 5) {
        alert("❌ הזן מספר רכב חוקי");
        return;
      }

      // שליחת בקשה לשרת להוספת הרכב ללקוח
      const res = await axios.put(`http://localhost:5000/api/customers/${selectedCustomer._id}/add-car`, {
        vehicleNumber,
      });

      alert("✅ רכב נוסף ללקוח בהצלחה!");
      handleCloseModal();
      fetchCustomers();
    } catch (error) {
      console.error("❌ שגיאה בהוספת רכב:", error.message);
      alert("❌ שגיאה בהוספת רכב");
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
            <th>רכבים</th>
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
                <span
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => navigate(`/customer-vehicles/${customer._id}`)}
                >
                  רכבים
                </span>
              </td>

              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleShowModal("edit", customer)}>
                  עריכה
                </button>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleShowModal("addCar", customer)}>
                  הוסף רכב
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
              <label>שם לקוח מלא</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^א-תa-zA-Z\s]/g, '');
                  setName(onlyLetters);
                }}
                required
              />

            </div>
            <div className="form-group mb-3">
              <label>תעודת זהות</label>
              <input
                type="text"
                className="form-control"
                value={idNumber}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  setIdNumber(onlyDigits);
                }}
                maxLength={9}
                required
              />

            </div>
            <div className="form-group mb-3">
              <label>מספר טלפון</label>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  style={{ maxWidth: "100px" }}
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  required
                >
                  <option value="050">050</option>
                  <option value="052">052</option>
                  <option value="053">053</option>
                  <option value="054">054</option>
                  <option value="055">055</option>
                  <option value="058">058</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  value={phoneSuffix}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, '');
                    setPhoneSuffix(onlyDigits);
                  }}
                  maxLength={7}
                  required
                />
              </div>
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
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  setvehicleNumber(onlyDigits);
                }}
                maxLength={9}
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

      {modalType === "addCar" && selectedCustomer && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleAddCar}>
          <h4>הוספת רכב ללקוח: {selectedCustomer.name}</h4>
          <div className="form-group mb-3">
            <label>מספר רכב חדש</label>
            <input
              type="text"
              className="form-control"
              value={vehicleNumber}
              onChange={(e) => setvehicleNumber(e.target.value.replace(/\D/g, ""))}
              maxLength={9}
              required
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Customers;
