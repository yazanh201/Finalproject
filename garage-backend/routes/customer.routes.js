// ייבוא express
const express = require('express');
const router = express.Router();

// ✅ ייבוא כל הפונקציות כולל addCarToCustomer ו־getNewCustomersThisMonth
const {
  addCustomer,
  getAllCustomers,
  searchCustomer,
  updateCustomer,
  getNewCustomersThisMonth,
  addCarToCustomer,
  getIdNumberByCarPlate,
  getEmailByCarPlate,
  deleteCustomer
} = require('../controllers/customer.controller');

/**
 * 📌 POST /api/customers
 * הוספת לקוח חדש למערכת
 */
router.post('/', addCustomer);

/**
 * 📌 GET /api/customers
 * שליפת כל הלקוחות הקיימים
 */
router.get('/', getAllCustomers);

/**
 * 📌 GET /api/customers/search?query=משה
 * חיפוש לקוחות לפי ת"ז או שם
 */
router.get('/search', searchCustomer);

/**
 * 📌 PUT /api/customers/:id
 * עדכון פרטי לקוח לפי מזהה
 */
router.put('/:id', updateCustomer);

/**
 * 📌 PUT /api/customers/:id/add-car
 * הוספת רכב ללקוח קיים
 */
router.put("/:id/add-car", addCarToCustomer);

/**
 * 📌 GET /api/customers/new-this-month
 * שליפת לקוחות שהצטרפו החודש
 */
router.get("/new-this-month", getNewCustomersThisMonth);

// שליפת תעודת זהות לפי מספר רכב
router.get('/id-by-plate/:plateNumber', getIdNumberByCarPlate);

router.get('/email-by-plate/:plateNumber', getEmailByCarPlate);

router.delete('/:id', deleteCustomer);


module.exports = router;
