const Inquiry = require('../models/Inquiry');

const addInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      message,
    });

    await newInquiry.save();
    res.status(201).json({ message: '✅ הפנייה נשמרה בהצלחה', inquiry: newInquiry });

  } catch (error) {
    console.error('❌ שגיאה בשמירת פנייה:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// controller
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


module.exports = {
  addInquiry,
  deleteInquiry
};
