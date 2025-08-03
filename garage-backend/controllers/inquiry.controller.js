const Inquiry = require('../models/Inquiry');

// ➕ שמירת פנייה חדשה
const addInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: '❌ שם, אימייל והודעה הם שדות חובה' });
    }

    const newInquiry = new Inquiry({ name, email, phone, message });
    await newInquiry.save();

    res.status(201).json({ message: '✅ הפנייה נשמרה בהצלחה', inquiry: newInquiry });
  } catch (error) {
    console.error('❌ שגיאה בשמירת פנייה:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// 📄 שליפת כל הפניות
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error("❌ שגיאה בשליפת פניות:", err.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: err.message });
  }
};

// 🗑️ מחיקת פנייה
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({ message: "❌ פנייה לא נמצאה למחיקה" });
    }
    res.json({ message: "✅ הפנייה נמחקה בהצלחה" });
  } catch (err) {
    console.error("❌ שגיאה במחיקת פנייה:", err.message);
    res.status(500).json({ message: "❌ שגיאה בשרת", error: err.message });
  }
};

module.exports = { addInquiry, getAllInquiries, deleteInquiry };
