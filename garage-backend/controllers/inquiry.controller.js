const Inquiry = require('../models/Inquiry');

// ➕ שמירת פנייה חדשה
const addInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // בדיקה אם שדות חובה קיימים
    if (!name || !email || !message) {
      return res.status(400).json({ message: '❌ שם, אימייל והודעה הם שדות חובה' });
    }

    // יצירת אובייקט פנייה חדש ושמירה במסד הנתונים
    const newInquiry = new Inquiry({ name, email, phone, message });
    await newInquiry.save();

    // תגובה חיובית עם הפנייה שנשמרה
    res.status(201).json({ message: '✅ הפנייה נשמרה בהצלחה', inquiry: newInquiry });
  } catch (error) {
    console.error('❌ שגיאה בשמירת פנייה:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// 📄 שליפת כל הפניות
const getAllInquiries = async (req, res) => {
  try {
    // שליפת כל הפניות מהחדשות לישנות
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error("❌ שגיאה בשליפת פניות:", err.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: err.message });
  }
};

// 🗑️ מחיקת פנייה לפי מזהה
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // מחיקת הפנייה לפי ID
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

// ✅ שליפת פנייה לפי מזהה
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: '❌ פנייה לא נמצאה' });
    }
    res.status(200).json(inquiry);
  } catch (err) {
    console.error("❌ שגיאה בשליפת פנייה לפי ID:", err.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: err.message });
  }
};

// ✏️ עדכון פנייה לפי ID
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInquiry = await Inquiry.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedInquiry) {
      return res.status(404).json({ message: "❌ פנייה לא נמצאה לעדכון" });
    }

    res.status(200).json(updatedInquiry);
  } catch (err) {
    console.error("❌ שגיאה בעדכון פנייה:", err.message);
    res.status(500).json({ message: "❌ שגיאה בשרת", error: err.message });
  }
};



module.exports = { addInquiry, getAllInquiries, deleteInquiry,getInquiryById , updateInquiry };
