const express = require('express');
const router = express.Router();
const upload = require('../upload.middleware');
const controller = require('../controllers/treatment.controller');

const {
  getAllTreatments,
  getTreatmentById,
  getTreatmentByObjectId,
  getTreatmentsByAppointmentNumber,
  getTreatmentsByDate,
  getTreatmentsByCarPlate,
  addTreatment,
  updateTreatment,
  confirmArrivalAndAddTreatment,
  getRevenueByCategory
} = controller;

// 📥 שליפות לפי קריטריונים
router.get('/', getAllTreatments);
router.get('/by-id/:treatmentId', getTreatmentById);
router.get('/check', controller.checkTreatmentByPlate);
router.get('/by-appointment/:appointmentNumber', getTreatmentsByAppointmentNumber);
router.get('/by-date/:date', getTreatmentsByDate);
router.get('/by-car/:carPlate', getTreatmentsByCarPlate);
router.get('/summary/revenue-by-category', getRevenueByCategory);

// ➕ הוספת טיפול עם העלאת קבצים (חשבונית + תמונות)
router.post(
  '/',
  upload.fields([
    { name: 'invoice', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  addTreatment
);

// ✅ יצירת טיפול אוטומטי מתוך תור
router.post('/confirm-arrival', confirmArrivalAndAddTreatment);

// ✏️ עדכון טיפול קיים לפי ID (כולל קבצים)
router.put(
  '/:id',
  upload.fields([
    { name: 'invoice', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  updateTreatment
);

// ❗ שים לב: חייב להיות אחרון – אחרת הוא יתפוס את כל הנתיבים כמו /by-car/...
router.get('/:id', getTreatmentByObjectId);

module.exports = router;
