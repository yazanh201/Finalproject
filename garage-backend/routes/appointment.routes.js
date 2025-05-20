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
  getAppointmentByNumber,
  getAppointmentsThisMonth // ✅
} = require('../controllers/appointment.controller');

router.post('/', addAppointment);
router.get('/', getAppointments);
router.get('/by-id/:idNumber', getByIdNumber);
router.get('/by-date/:date', getByDate);
router.put('/:id', updateAppointment);
router.get('/by-car/:carNumber', getByCarNumber);
router.get('/search/:term', getByIdOrCar);
router.get('/by-number/:appointmentNumber', getAppointmentByNumber);

// ✅ חדש – שליפת תורים של החודש הנוכחי
router.get('/month', getAppointmentsThisMonth);

module.exports = router;
