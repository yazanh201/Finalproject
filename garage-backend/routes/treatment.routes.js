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
} = require('../controllers/treatment.controller');

// 📥 שליפות
router.get('/', getAllTreatments);
router.get('/by-id/:treatmentId', getTreatmentById);
router.get('/check', controller.checkTreatmentByPlate);
router.get('/:id', getTreatmentByObjectId);
router.get('/by-appointment/:appointmentNumber', getTreatmentsByAppointmentNumber);
router.get('/by-date/:date', getTreatmentsByDate);
router.get('/by-car/:carPlate', getTreatmentsByCarPlate);
router.get('/summary/revenue-by-category', getRevenueByCategory);
router.get('/:id', getTreatmentByObjectId);



// ➕ הוספה עם העלאת קבצים (חשבונית + תמונות)
router.post(
  '/',
  upload.fields([
    { name: 'invoice', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  addTreatment
);

// ✏️ עדכון עם העלאת קבצים – חובה כמו ב־POST
router.put(
  '/:id',
  upload.fields([
    { name: 'invoice', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  updateTreatment
);

// ✅ יצירת טיפול אוטומטי מתוך תור
router.post('/confirm-arrival', confirmArrivalAndAddTreatment);

module.exports = router;
