const express = require('express');
const router = express.Router();
const { addInquiry, getAllInquiries, deleteInquiry, getInquiryById , updateInquiry } = require('../controllers/inquiry.controller');

// ➕ הוספת פנייה חדשה ללקוח
router.post('/', addInquiry);

// 📄 שליפת כל הפניות מהשרת (למנהל)
router.get('/', getAllInquiries);

// 📄 שליפת פנייה לפי מזהה (👈 צריך לבוא לפני DELETE!)
router.get('/:id', getInquiryById);

router.put('/:id', updateInquiry);

// 🗑️ מחיקת פנייה לפי מזהה
router.delete('/:id', deleteInquiry);

module.exports = router;
