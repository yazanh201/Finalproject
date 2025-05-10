const express = require('express');
const router = express.Router();
const {
  addAppointment,
  getAppointments,
  getByIdNumber,
  getByDate,
  getByCarNumber,
  updateAppointment,
  getByIdOrCar,
  getAppointmentByNumber 
} = require('../controllers/appointment.controller');

// POST - הוספת תור
router.post('/', addAppointment);

// GET - כל התורים
router.get('/', getAppointments);

// GET - לפי ת"ז
router.get('/by-id/:idNumber', getByIdNumber);

// GET - לפי תאריך
router.get('/by-date/:date', getByDate);

// PUT - עדכון תור
router.put('/:id', updateAppointment);

// GET - לפי מספר רכב
router.get('/by-car/:carNumber', getByCarNumber);

router.get('/search/:term', getByIdOrCar);

// GET - לפי מזהה תור (appointmentNumber)
router.get('/by-number/:appointmentNumber', getAppointmentByNumber);






module.exports = router;
