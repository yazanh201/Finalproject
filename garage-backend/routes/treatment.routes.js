const express = require('express');
const router = express.Router();

const {
  getAllTreatments,
  getTreatmentById,              // שליפה לפי treatmentNumber
  getTreatmentByObjectId,       // ✅ שליפה לפי _id של MongoDB
  getTreatmentsByAppointmentNumber,
  getTreatmentsByDate,
  getTreatmentsByCarPlate,
  addTreatment,
  updateTreatment,
  confirmArrivalAndAddTreatment
} = require('../controllers/treatment.controller');

// 📥 שליפות
router.get('/', getAllTreatments);
router.get('/by-id/:treatmentId', getTreatmentById);            // לפי treatmentNumber
router.get('/:id', getTreatmentByObjectId);                     // ✅ לפי _id (לצורך תצוגת פרטי טיפול)
router.get('/by-appointment/:appointmentNumber', getTreatmentsByAppointmentNumber);
router.get('/by-date/:date', getTreatmentsByDate);
router.get('/by-car/:carPlate', getTreatmentsByCarPlate);

// ➕ הוספה
router.post('/', addTreatment);

// ✏️ עדכון
router.put('/:id', updateTreatment);

// ✅ יצירת טיפול אוטומטי מתוך תור מאושר
router.post('/confirm-arrival', confirmArrivalAndAddTreatment);

module.exports = router;
