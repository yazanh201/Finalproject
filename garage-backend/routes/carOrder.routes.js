const express = require('express');
const router = express.Router();
const {
  createCarOrder,
  getAllCarOrders,
  updateCarOrder,
  searchCarOrdersByCarNumber
} = require('../controllers/carOrder.controller');

// יצירת הזמנה חדשה
router.post('/', createCarOrder);

// שליפת כל ההזמנות
router.get('/', getAllCarOrders);

// עדכון הזמנה לפי מזהה
router.put('/:id', updateCarOrder);

// חיפוש לפי מספר רכב
router.get('/search/:carNumber', searchCarOrdersByCarNumber);

module.exports = router;
