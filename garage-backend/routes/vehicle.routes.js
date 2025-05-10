const express = require('express');
const router = express.Router();

// ייבוא הפונקציות מהקונטרולר
const {
  addVehicle,
  getAllVehicles,
  searchVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicle.controller');

/**
 * 📌 POST /api/cars
 * הוספת רכב חדש
 */
router.post('/', addVehicle);

/**
 * 📌 GET /api/cars
 * שליפת כל הרכבים
 */
router.get('/', getAllVehicles);

/**
 * 📌 GET /api/cars/search?query=
 * חיפוש רכבים לפי מספר רכב או ת"ז בעלים
 */
router.get('/search', searchVehicle);

/**
 * 📌 PUT /api/cars/:id
 * עדכון רכב לפי מזהה
 */
router.put('/:id', updateVehicle);

/**
 * 📌 DELETE /api/cars/:id
 * מחיקת רכב לפי מזהה
 */
router.delete('/:id', deleteVehicle);

// ייצוא הראוטר
module.exports = router;
