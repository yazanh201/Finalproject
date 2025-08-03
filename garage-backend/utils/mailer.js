const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// פונקציה לשליחת חשבוניות (קיימת אצלך)
const sendInvoiceEmail = async ({ to, subject, text, attachments }) => {
  const mailOptions = {
    from: `"מוסך שירות מהיר" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || '📄 החשבונית שלך ממוסך שירות מהיר',
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f9f9f9; padding: 20px;">
        <div style="background: #4caf50; color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">מוסך שירות מהיר</h2>
        </div>
        <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #333;">שלום,</h3>
          <p style="font-size: 16px; color: #555;">
            תודה שבחרת בשירותי <strong>מוסך שירות מהיר</strong>.
          </p>
          <p style="font-size: 15px; color: #333;">
            מצורפת החשבונית עבור השירות שבוצע עבורך. 
          </p>
          <div style="background: #f1f1f1; padding: 10px; border-radius: 6px; margin-top: 10px;">
            <p><strong>💾 חשבונית:</strong> מצורפת כקובץ למייל זה.</p>
          </div>
          <p style="margin-top: 20px; font-size: 15px; color: #333;">
            אם יש לך שאלות נוספות לגבי החשבונית או השירות שבוצע, נשמח לעזור לך.
          </p>
          <p style="margin-top: 10px; color: #4caf50; font-weight: bold;">
            🚗 צוות מוסך שירות מהיר
          </p>
          <hr style="margin-top: 20px;"/>
          <p style="font-size: 12px; color: #888;">
            הודעה זו נשלחה אליך אוטומטית. במידה ויש לך שאלות ניתן ליצור קשר בטלפון המוסך.
          </p>
        </div>
      </div>
    `,
    attachments
  };

  await transporter.sendMail(mailOptions);
};


// 🆕 פונקציה לשליחת מייל על קביעת תור
const sendAppointmentEmail = async ({ to, name, date, time, description }) => {
  const mailOptions = {
    from: `"מוסך שירות מהיר" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📅 התור שלך נקבע בהצלחה – מוסך שירות מהיר`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f9f9f9; padding: 20px;">
        <div style="background: #1e88e5; color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">מוסך שירות מהיר</h2>
        </div>
        <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="color: #333;">שלום ${name},</h3>
          <p style="font-size: 16px; color: #555;">
            התור שלך נקבע בהצלחה! תודה שבחרת ב<strong> מוסך שירות מהיר </strong>.
          </p>
          <div style="background: #f1f1f1; padding: 10px; border-radius: 6px; margin-top: 10px;">
            <p><strong>📅 תאריך:</strong> ${date}</p>
            <p><strong>⏰ שעה:</strong> ${time}</p>
            <p><strong>🔧 שירות:</strong> ${description || 'לא צוין'}</p>
          </div>
          <p style="margin-top: 20px; font-size: 15px; color: #333;">
            אנחנו מחכים לראותך ומתחייבים לשירות מהיר ומקצועי.
          </p>
          <p style="margin-top: 10px; color: #1e88e5; font-weight: bold;">
            🚗 צוות מוסך שירות מהיר
          </p>
          <hr style="margin-top: 20px;"/>
          <p style="font-size: 12px; color: #888;">
            הודעה זו נשלחה אליך אוטומטית. במידה ויש לך שאלות ניתן ליצור קשר בטלפון המוסך.
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};



// ייצוא שתי הפונקציות
module.exports = { sendInvoiceEmail, sendAppointmentEmail };
