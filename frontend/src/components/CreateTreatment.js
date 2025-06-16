import React, { useState, useEffect } from 'react';
import './cssfiles/createtreatment.css';
import { useLocation, useNavigate } from 'react-router-dom';

const repairOptions = {
  "שירות כללי": [
    "החלפת שמן מנוע",
    "החלפת פלאגים",
    "החלפת מסנן שמן",
    "החלפת מסנן אוויר",
    "בדיקת נוזל בלמים",
    "בדיקת רצועות",
    "בדיקת נוזל קירור",
    "בדיקת בלמים",
    "החלפת רפידות בלם",
    "החלפת דיסקים"
  ],
  "בדיקת מנוע ותיבת הילוכים": [
    "בדיקת מנוע כללית",
    "החלפת שמן מנוע",
    "החלפת טיימינג",
    "החלפת רצועת אביזרים",
    "בדיקת תיבת הילוכים אוטומטית",
    "החלפת שמן גיר",
    "בדיקת לחץ שמן מנוע",
    "בדיקת נזילות מהמנוע או הגיר"
  ],
  "טיפול חשמל": [
    "בדיקת מצבר ומתח",
    "החלפת מצבר",
    "בדיקת טעינה של האלטרנטור",
    "החלפת פיוזים",
    "תיקון תאורה פנימית / חיצונית",
    "תיקון חלונות חשמליים",
    "בדיקת מערכת הנעה",
    "בדיקת תקלות במחשב הרכב"
  ]
};

const CreateTreatment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const allowedStatuses = ['בטיפול', 'ממתין לחלקים', 'בעיכוב', 'הסתיים'];
  const initialStatus = allowedStatuses.includes(state.status) ? state.status : 'בטיפול';

  const [form, setForm] = useState({
    date: state.date || new Date().toISOString().split("T")[0],
    cost: state.cost || '',
    carPlate: state.plateNumber || '',
    description: state.description || '',
    workerName: state.workerName || '',
    customerName: state.customerName || '',
    images: [],
    invoiceFile: null,
    repairTypeId: state.repairTypeId || '',
    status: initialStatus,
    treatmentId: state.treatmentId || '',
    workerId: state.workerId || '',
    idNumber: state.idNumber || ''
  });

  const [treatmentServices, setTreatmentServices] = useState([]);

  // ✅ Load treatment checklist if editing
  useEffect(() => {
    if (state.treatmentServices && Array.isArray(state.treatmentServices)) {
      setTreatmentServices(state.treatmentServices);
    }
  }, [state.treatmentServices]);

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

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const exists = treatmentServices.find((s) => s.category === category);
    if (!exists && category) {
      setTreatmentServices((prev) => [...prev, { category, selectedOptions: [] }]);
    }
  };

  const handleChecklistChange = (category, task) => {
    setTreatmentServices((prev) =>
      prev.map((service) =>
        service.category === category
          ? {
              ...service,
              selectedOptions: service.selectedOptions.includes(task)
                ? service.selectedOptions.filter((t) => t !== task)
                : [...service.selectedOptions, task]
            }
          : service
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
    const isEdit = form.treatmentId && form.treatmentId.trim() !== "";
    const url = isEdit
      ? `${API_BASE}/api/treatments/${form.treatmentId}`
      : `${API_BASE}/api/treatments`;
    const method = isEdit ? 'PUT' : 'POST';

    const formData = new FormData();

    for (const key in form) {
      if (key === "images" && Array.isArray(form[key]) && form[key].length > 0) {
        form[key].forEach((img) => formData.append("images", img));
      } else if (key === "invoiceFile" && form.invoiceFile) {
        formData.append("invoice", form.invoiceFile);
      } else if (key !== "treatmentId") {
        formData.append(key, form[key]);
      }
    }

    formData.append("treatmentServices", JSON.stringify(treatmentServices));

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("🧨 תגובה מהשרת אינה JSON:\n", text);
        throw new Error(`שגיאה לא צפויה מהשרת:\n${text}`);
      }

      if (!response.ok) throw new Error(data.message || 'שגיאה בשמירה');

      alert(`✅ הטיפול ${isEdit ? 'עודכן בהצלחה' : 'נשמר בהצלחה'}!`);

      if (!isEdit) {
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
          status: 'בטיפול',
          treatmentId: '',
          workerId: '',
          idNumber: ''
        });
        setTreatmentServices([]);
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error("❌ שגיאה בבקשה:", err);
      alert(`❌ שגיאה: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">טופס טיפול לרכב</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* left column */}
            <div className="col-md-6">
              <label className="form-label">תאריך</label>
              <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />

              <label className="form-label mt-3">מספר רכב</label>
              <input type="text" name="carPlate" className="form-control" value={form.carPlate} onChange={handleChange} required />

              <label className="form-label mt-3">שם לקוח</label>
              <input type="text" name="customerName" className="form-control" value={form.customerName} onChange={handleChange} required />
            </div>

            {/* right column */}
            <div className="col-md-6">
              <label className="form-label">עלות</label>
              <input type="number" name="cost" className="form-control" value={form.cost} onChange={handleChange} />

              <label className="form-label mt-3">שם עובד</label>
              <input type="text" name="workerName" className="form-control" value={form.workerName} onChange={handleChange} required />

              <label className="form-label mt-3">סטטוס</label>
              <select name="status" className="form-control" value={form.status} onChange={handleChange} required>
                <option value="בטיפול">בטיפול</option>
                <option value="ממתין לחלקים">ממתין לחלקים</option>
                <option value="בעיכוב">בעיכוב</option>
                <option value="הסתיים">הסתיים</option>
              </select>
            </div>

            {/* checklist selection */}
            <div className="col-md-6">
              <label className="form-label mt-3">בחר קטגוריה להוספה</label>
              <select className="form-control" onChange={handleCategoryChange}>
                <option value="">בחר קטגוריה</option>
                {Object.keys(repairOptions).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {treatmentServices.map(({ category, selectedOptions }) => (
              <div className="col-12" key={category}>
                <label className="form-label mt-3">{`משימות בקטגוריה: ${category}`}</label>
                <div className="form-check-list">
                  {repairOptions[category]?.map((task) => (
                    <div className="check-option" key={task}>
                      <label htmlFor={`${category}-${task}`}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedOptions.includes(task)}
                          onChange={() => handleChecklistChange(category, task)}
                          id={`${category}-${task}`}
                        />
                        <span className="check-label">{task}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

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
              <button type="button" className="btn btn-secondary mx-2 px-4" onClick={() => navigate(-1)}>ביטול</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTreatment;
