import React, { useState, useEffect } from 'react';
import './createtreatment.css';
import { useLocation } from 'react-router-dom';

const CreateTreatment = () => {
  const location = useLocation();
  const state = location.state || {};

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    cost: '',
    carPlate: state.plateNumber || '',
    description: '',
    workerName: state.workerName || '',
    customerName: state.customerName || '',
    images: [],
    invoiceFile: null,
    repairTypeId: '',
    status: 'בהמתנה'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, invoiceFile: e.target.files[0] }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in form) {
      if (key === "images") {
        form.images.forEach((img) => formData.append("images", img));
      } else if (key === "invoiceFile" && form.invoiceFile) {
        formData.append("invoice", form.invoiceFile);
      } else {
        formData.append(key, form[key]);
      }
    }

    try {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'שגיאה בשמירה');

      alert('✅ הטיפול נשמר בהצלחה!');
      setForm({
        date: new Date().toISOString().split("T")[0],
        cost: '',
        carPlate: '',
        description: '',
        workerName: '',
        customerName: '',
        images: [],
        invoiceFile: null,
        repairTypeId: '',
        status: 'בהמתנה'
      });
    } catch (err) {
      console.error(err);
      alert(`❌ שגיאה: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">טופס טיפול לרכב</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">תאריך</label>
              <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />

              <label className="form-label mt-3">מספר רכב</label>
              <input type="text" name="carPlate" className="form-control" value={form.carPlate} onChange={handleChange} required />

              <label className="form-label mt-3">שם לקוח</label>
              <input type="text" name="customerName" className="form-control" value={form.customerName} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">עלות</label>
              <input type="number" name="cost" className="form-control" value={form.cost} onChange={handleChange} required />

              <label className="form-label mt-3">שם עובד</label>
              <input type="text" name="workerName" className="form-control" value={form.workerName} onChange={handleChange} required />

              <label className="form-label mt-3">סטטוס</label>
              <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                <option value="בהמתנה">בהמתנה</option>
                <option value="הסתיים">הסתיים</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">תיאור הטיפול</label>
              <textarea className="form-control" name="description" rows="3" value={form.description} onChange={handleChange}></textarea>
            </div>

            <div className="col-12">
              <label className="form-label">חשבונית (PDF או תמונה)</label>
              <input type="file" className="form-control" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>

            <div className="col-12">
              <label className="form-label">תמונות מהטיפול</label>
              <input type="file" className="form-control" multiple accept="image/*" onChange={handleImagesChange} />
            </div>

            <div className="col-12 text-center mt-4">
              <button type="submit" className="btn btn-success mx-2 px-4">שמור ושלח</button>
              <button type="button" className="btn btn-outline-primary mx-2 px-4">שמור כטיוטה</button>
              <button type="button" className="btn btn-secondary mx-2 px-4">ביטול</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTreatment;
