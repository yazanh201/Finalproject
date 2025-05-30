const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { addInquiry } = require('../controllers/inquiry.controller');

// POST חדש
router.post('/', addInquiry);

// GET כל הפניות
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
});

// ✅ PUT לעדכון פנייה לפי ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'פנייה לא נמצאה' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בעדכון פנייה', error: err.message });
  }
});

module.exports = router;
