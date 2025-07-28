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
  getAvailableTimes,
  getAppointmentByNumber,
  rejectArrival,
  confirmArrival,
  getAppointmentsThisMonth, // ✅
  searchCustomersByName,
  deleteAppointment
} = require('../controllers/appointment.controller');

router.post('/', addAppointment);
router.get('/', getAppointments);
router.get('/by-id/:idNumber', getByIdNumber);
router.get('/by-date/:date', getByDate);
router.put('/:id', updateAppointment);
router.get('/by-car/:carNumber', getByCarNumber);
router.get('/search/:term', getByIdOrCar);
router.get('/by-number/:appointmentNumber', getAppointmentByNumber);
router.get('/available-times/:date', getAvailableTimes);
router.post('/appointments/:id/confirm-arrival', confirmArrival);
router.post('/appointments/:id/reject-arrival', rejectArrival);
router.get('/search', searchCustomersByName);


// ✅ חדש – שליפת תורים של החודש הנוכחי
router.get('/month', getAppointmentsThisMonth);

router.delete('/:id', deleteAppointment);


module.exports = router;
