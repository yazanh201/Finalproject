// ייבוא express
const express = require('express');
const router = express.Router();

// ייבוא הפונקציות מ-controller
const { addCustomer, getAllCustomers, searchCustomer, updateCustomer } = require('../controllers/customer.controller');

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

// ייצוא ה-router לשימוש בקובץ server.js
module.exports = router;
