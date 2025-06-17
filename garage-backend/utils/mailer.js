const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendInvoiceEmail = async ({ to, subject, text, attachments }) => {
  const mailOptions = {
    from: `"מוסך שירות מהיר" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || 'חשבונית מהמוסך',
    text: text || 'מצורפת החשבונית שלך',
    attachments
  };

  await transporter.sendMail(mailOptions);
};

// ✅ שים לב לשורת הייצוא:
module.exports = { sendInvoiceEmail };
