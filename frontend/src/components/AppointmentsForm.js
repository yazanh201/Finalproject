import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CreateAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [form, setForm] = useState({
    date: '',
    time: '',
    description: '',
    idNumber: '',
    name: '',
    phonePrefix: '050',
    phoneNumber: '',
    carNumber: '',
  });

  useEffect(() => {
    if (location.state) {
      const data = location.state;
      setForm({
        date: data.date || '',
        time: data.time || '',
        description: data.description || '',
        idNumber: data.idNumber || '',
        name: data.name || '',
        phonePrefix: data.phoneNumber ? data.phoneNumber.substring(0, 3) : '050',
        phoneNumber: data.phoneNumber ? data.phoneNumber.substring(3) : '',
        carNumber: data.carNumber || ''
      });
      fetchAvailableTimes(data.date);
    } else if (id) {
      fetch(`http://localhost:5000/api/appointments/by-number/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            date: data.date || '',
            time: data.time || '',
            description: data.description || '',
            idNumber: data.idNumber || '',
            name: data.name || '',
            phonePrefix: data.phoneNumber ? data.phoneNumber.substring(0, 3) : '050',
            phoneNumber: data.phoneNumber ? data.phoneNumber.substring(3) : '',
            carNumber: data.carNumber || ''
          });
          fetchAvailableTimes(data.date);
        })
        .catch(err => console.error('❌ שגיאה בטעינת נתוני עריכה:', err));
    }
  }, [location.state, id]);

  const fetchAvailableTimes = async (date) => {
    if (!date) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/available-times/${date}`);
      const data = await res.json();
      const times = data.includes(form.time) || !form.time ? data : [...data, form.time];
      setAvailableTimes(times);
    } catch (error) {
      console.error('❌ שגיאה בשליפת שעות פנויות:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date') {
      const today = new Date().toISOString().slice(0, 10);
      if (value < today) {
        toast.error('❌ לא ניתן לבחור תאריך שכבר עבר!');
        return;
      }
      fetchAvailableTimes(value);
    }

    if (name === 'idNumber' && !/^\d{0,9}$/.test(value)) return;
    if (name === 'name') {
      if (!/^[א-תa-zA-Z\s]*$/.test(value)) return;
      fetchCustomerSuggestions(value);
    }

    if (name === 'phoneNumber' && !/^\d{0,7}$/.test(value)) return;
    if (name === 'carNumber' && !/^\d{0,8}$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.idNumber.length !== 9) {
      toast.error(' תעודת זהות חייבת להכיל בדיוק 9 ספרות');
      return;
    }
    if (!/^[א-תa-zA-Z\s]+$/.test(form.name)) {
      toast.error(' שם הלקוח חייב להכיל אותיות בלבד');
      return;
    }
    if (!/^\d{7}$/.test(form.phoneNumber)) {
      toast.error(' מספר הטלפון חייב להכיל 7 ספרות');
      return;
    }
    if (!/^\d{1,8}$/.test(form.carNumber)) {
      toast.error(' מספר רכב חייב להכיל עד 8 ספרות');
      return;
    }

    const fullPhone = form.phonePrefix + form.phoneNumber;
    const payload = { ...form, phoneNumber: fullPhone };

    try {
      const isEdit = location.state?._id || id;
      const url = isEdit
        ? `http://localhost:5000/api/appointments/${location.state?._id || id}`
        : 'http://localhost:5000/api/appointments';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'שגיאה בשמירה');

      toast.success(` התור ${isEdit ? 'עודכן' : 'נשמר'} בהצלחה!`);

      setForm({
        date: '',
        time: '',
        description: '',
        idNumber: '',
        name: '',
        phonePrefix: '050',
        phoneNumber: '',
        carNumber: '',
      });

      navigate('/Dashboard');
    } catch (error) {
      console.error(error);
      toast.error(` שגיאה: ${error.message}`);
    }
  };

  const fetchCustomerSuggestions = (value) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/customers/search?query=${value}`);
          const data = await res.json();
          setSuggestions(data);
        } catch (error) {
          console.error('שגיאה בחיפוש לקוחות:', error);
        }
      }, 300)
    );
  };

  return (
    <div className="container mt-5" dir="rtl">
      <div className="card shadow p-4 position-relative">
        <h3 className="text-center mb-4">
          {location.state || id ? "עריכת תור" : "קביעת תור חדש"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">תאריך</label>
              <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />

              <label className="form-label mt-3">שעה</label>
              <select name="time" className="form-control" value={form.time} onChange={handleChange}>
                <option value="">בחר שעה</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

              <label className="form-label mt-3">תיאור</label>
              <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange}></textarea>
            </div>

            <div className="col-md-6 position-relative">
              <label className="form-label">שם לקוח</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              {suggestions.length > 0 && (
                <ul className="list-group position-absolute z-3 w-100" style={{ maxHeight: 150, overflowY: "auto" }}>
                  {suggestions.map((s) => (
                    <li
                      key={s._id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          name: s.name,
                          idNumber: s.idNumber,
                          phoneNumber: s.phoneNumber?.substring(3) || "",
                          phonePrefix: s.phoneNumber?.substring(0, 3) || "050",
                        }));
                        setSuggestions([]);
                      }}
                    >
                      {s.name} – {s.idNumber}
                    </li>
                  ))}
                </ul>
              )}

              <label className="form-label mt-3">תעודת זהות</label>
              <input
                type="text"
                name="idNumber"
                className="form-control"
                value={form.idNumber}
                onChange={handleChange}
                required
              />

              <label className="form-label mt-3">טלפון</label>
              <div className="d-flex">
                <select name="phonePrefix" className="form-select w-auto" value={form.phonePrefix} onChange={handleChange}>
                  {["050", "052", "053", "054", "055", "056", "057", "058", "059"].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control ms-2"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="7 ספרות"
                />
              </div>

              <label className="form-label mt-3">מספר רישוי</label>
              <input type="text" name="carNumber" className="form-control" value={form.carNumber} onChange={handleChange} required />
            </div>

            <div className="col-12 text-center mt-4">
              <button type="submit" className="btn btn-success mx-2 px-4">{location.state || id ? "עדכן" : "שמור "}</button>
              <button type="button" className="btn btn-secondary mx-2 px-4" onClick={() => navigate('/Dashboard')}>ביטול</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
