const mongoose = require('mongoose');

// 📌 סכמת תור (Appointment)
const appointmentSchema = new mongoose.Schema({
  // ✅ מזהה תור רץ וייחודי (לצורכי תצוגה וארגון)
  appointmentNumber: {
    type: Number,
    required: true,
    unique: true
  },

  // ✅ תאריך התור (מחרוזת בפורמט YYYY-MM-DD)
  date: {
    type: String,
    required: true
  },

  // ✅ שעת התור (מחרוזת – לדוג' "10:00")
  time: {
    type: String,
    required: true
  },

  // ✅ תיאור קצר של סיבת התור או מהות השירות
  description: {
    type: String,
    required: true
  },

  // ✅ מספר תעודת זהות של הלקוח
  idNumber: {
    type: String,
    required: true
  },

  // ✅ שם הלקוח
  name: {
    type: String,
    required: true
  },

  // ✅ מספר רכב של הלקוח
  carNumber: {
    type: String,
    required: true
  },

  // ✅ מספר טלפון ליצירת קשר (שדה רשות)
  phoneNumber: {
    type: String,
    required: false
  },

  // ✅ סטטוס הגעה של הלקוח (ברירת מחדל: "בהמתנה")
  arrivalStatus: {
    type: String,
    enum: ["הגיע", "לא הגיע", "בהמתנה"], // רק אחד מהערכים האפשריים
    default: "בהמתנה"
  },

  // ✅ קישור לטיפול שנוצר בעקבות התור (אם קיים)
  treatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment'
  }
}, {
  // ✅ תיעוד תאריכי יצירה ועדכון אוטומטיים
  timestamps: true
});

// ✅ יצירת המודל וייצואו
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
