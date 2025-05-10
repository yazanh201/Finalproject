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

module.exports = {
  addInquiry,
};
