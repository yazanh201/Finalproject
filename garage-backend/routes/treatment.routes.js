const express = require('express');
const router = express.Router();
const {
  getAllTreatments,
  getTreatmentById,
  getTreatmentsByAppointmentNumber,
  getTreatmentsByDate,
  getTreatmentsByCarPlate,
  addTreatment,
  updateTreatment,
  confirmArrivalAndAddTreatment // ✅ נוספה
} = require('../controllers/treatment.controller');

// שליפות
router.get('/', getAllTreatments);
router.get('/by-id/:treatmentId', getTreatmentById);
router.get('/by-appointment/:appointmentNumber', getTreatmentsByAppointmentNumber);
router.get('/by-date/:date', getTreatmentsByDate);
router.get('/by-car/:carPlate', getTreatmentsByCarPlate);

// הוספה ועדכון
router.post('/', addTreatment);
router.put('/:id', updateTreatment);

// ✅ הנתיב שחסר לך
router.post('/confirm-arrival', confirmArrivalAndAddTreatment);

module.exports = router;
