import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const repairOptions = {
    "שירותים וטיפולים": [
        "הכנה לטסט שנתי",
        "החלפת שמן מנוע ומסנן שמן",
        "החלפת מסנן אוויר", 
        "החלפת מסנן מזגן",
        "החלפת פלאגים (מצתים)",
        "בדיקה ומילוי נוזל בלמים",
        "בדיקה ומילוי נוזל קירור",
        "בדיקת רצועות"
    ],
    "מנוע": [
        "אבחון תקלות מנוע (דיאגנוסטיקה)",
        "החלפת רצועת טיימינג",
        "החלפת רצועת אביזרים",
        "ניקוי מצערת ומזרקים",
        "בדיקת לחץ שמן מנוע",
        "תיקון נזילות שמן מהמנוע",
        "שיפוץ ראש מנוע"
    ],
    "תיבת הילוכים": [
        "בדיקת תיבת הילוכים אוטומטית/ידנית",
        "החלפת שמן גיר ומסנן",
        "שיפוץ/החלפת גיר",
        "החלפת מצמד (קלאץ')",
        "תיקון נזילות שמן מהגיר"
    ],
    "מערכת הבלמים": [
        "החלפת רפידות בלם קדמיות/אחוריות",
        "החלפת דיסקים (צלחות) בלם",
        "ניקוי וגירוז קליפרים",
        "החלפת נוזל בלמים"
    ],
    "חשמל ודיאגנוסטיקה": [
        "בדיקת תקלות במחשב הרכב",
        "בדיקת מצבר וטעינה",
        "החלפת מצבר",
        "בדיקה/החלפת אלטרנטור",
        "תיקון תאורה חיצונית/פנימית",
        "תיקון חלונות חשמליים ומנעולים"
    ],
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

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    // טעינה מחדש של קטגוריות ומשימות אם מדובר בעריכה
  useEffect(() => {
    if (state.treatmentServices) {
        try {
            const parsed = typeof state.treatmentServices === 'string'
                ? JSON.parse(state.treatmentServices)
                : state.treatmentServices;
            setSelectedCategories(parsed);
        } catch (err) {
            console.error("שגיאה בטעינת קטגוריות קיימות", err);
        }
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

    const handleAddCategory = (category) => {
        if (!category) return;
        const exists = selectedCategories.some(c => c.category === category);
        if (!exists) {
            setSelectedCategories(prev => [...prev, { category, selectedOptions: [] }]);
        }
        setSelectedCategory('');
    };

    const handleChecklistChange = (category, task) => {
        setSelectedCategories(prev =>
            prev.map(c =>
                c.category !== category
                    ? c
                    : {
                        ...c,
                        selectedOptions: c.selectedOptions.includes(task)
                            ? c.selectedOptions.filter(t => t !== task)
                            : [...c.selectedOptions, task]
                    }
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEdit = form.treatmentId && form.treatmentId.trim() !== '';
        const url = isEdit
            ? `/api/treatments/${form.treatmentId}`
            : '/api/treatments';
        const method = isEdit ? 'PUT' : 'POST';

        const formData = new FormData();
        for (const key in form) {
            if (key === "images") {
                form.images.forEach((img) => formData.append("images", img));
            } else if (key === "invoiceFile" && form.invoiceFile) {
                formData.append("invoice", form.invoiceFile);
            } else if (key !== "treatmentId") {
                formData.append(key, form[key]);
            }
        }

        formData.append("treatmentServices", JSON.stringify(selectedCategories));

        try {
            const response = await fetch(url, {
                method,
                body: formData
            });

            const data = await response.json();
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
                setSelectedCategories([]);
                setSelectedCategory('');
            } else {
                navigate(-1);
            }
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
                            <input type="number" name="cost" className="form-control" value={form.cost} onChange={handleChange} />
                            <label className="form-label mt-3">שם עובד</label>
                            <input type="text" name="workerName" className="form-control" value={form.workerName} onChange={handleChange} required />
                            <label className="form-label mt-3">סטטוס</label>
                            <select name="status" className="form-control" value={form.status} onChange={handleChange} required>
                                {allowedStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label mt-3">בחר קטגוריה</label>
                            <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">בחר קטגוריה</option>
                                {Object.keys(repairOptions).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button type="button" className="btn btn-sm btn-primary mt-2" onClick={() => handleAddCategory(selectedCategory)}>
                                ➕ הוסף קטגוריה
                            </button>
                        </div>

                        {/* הצגת הקטגוריות והמשימות שנבחרו */}
                        {selectedCategories.map(({ category, selectedOptions }) => (
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
