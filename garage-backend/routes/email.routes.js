const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendInvoiceEmail } = require('../utils/mailer');

// הגדרת multer לשמירה זמנית בזיכרון (ולא בקובץ)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/*
  📩 שליחת חשבונית בפורמט PDF למייל
  מקבל את כתובת המייל מה־body ואת קובץ ה־PDF מה־form-data
*/
router.post('/send-invoice', upload.single('pdf'), async (req, res) => {
  try {
    const { email } = req.body;

    // יצירת קובץ מצורף מסוג PDF מתוך buffer
    const attachments = [
      {
        filename: 'invoice.pdf',
        content: req.file.buffer,
        contentType: 'application/pdf'
      }
    ];

    // שליחת המייל עם החשבונית
    await sendInvoiceEmail({
      to: email,
      subject: '📄 חשבונית מהמוסך',
      text: 'שלום, מצורפת החשבונית שלך מהמוסך. תודה שבחרת בנו!',
      attachments
    });

    res.status(200).json({ message: '✅ מייל נשלח בהצלחה!' });
  } catch (err) {
    console.error('❌ שגיאה בשליחת מייל:', err);
    res.status(500).json({ message: 'שגיאה בשליחת מייל', error: err.message });
  }
});

// ייצוא הראוטר לשימוש באפליקציה הראשית
module.exports = router;
