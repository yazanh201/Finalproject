const express = require('express');
const router = express.Router();
const { addInquiry, getAllInquiries, deleteInquiry } = require('../controllers/inquiry.controller');

router.post('/', addInquiry);       // ➕ הוספת פנייה
router.get('/', getAllInquiries);   // 📄 שליפת כל הפניות
router.delete('/:id', deleteInquiry); // 🗑️ מחיקה לפי ID

module.exports = router;
