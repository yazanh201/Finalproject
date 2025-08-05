const mongoose = require('mongoose');

/*
  סכמה ללקוח (Customer)
  מייצגת לקוחות של המוסך – כולל ת"ז, שם, טלפון, דוא"ל, סטטוס ורכבים משויכים
*/
const customerSchema = new mongoose.Schema({

  // שם הלקוח (עברית או אנגלית, לפחות 2 תווים)
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    match: /^[\u0590-\u05FFa-zA-Z\s]+$/, // עברית/אנגלית בלבד
  },

  // מספר תעודת זהות (בדיוק 9 ספרות, ייחודי)
  idNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{9}$/, // בדיוק 9 ספרות
  },

  // מספר טלפון נייד ישראלי (10 ספרות, מתחיל ב-05)
  phone: {
    type: String,
    required: true,
    match: /^05\d{8}$/, // קידומת חוקית עם 10 ספרות
  },

  // כתובת אימייל (אופציונלית, תקנית)
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // אימייל תקני
  },

  // סטטוס לקוח – פעיל או לא פעיל (ברירת מחדל: פעיל)
  status: {
    type: String,
    enum: ['פעיל', 'לא פעיל'],
    default: 'פעיל',
  },

  // רשימת רכבים (כמחרוזות של מספרים עד 9 ספרות)
  vehicles: [
    {
      type: String,
      ref: 'Vehicle',
      match: /^\d{1,9}$/, // עד 9 ספרות למספר רכב
    }
  ],
  
}, { 
  // תיעוד אוטומטי של createdAt ו־updatedAt
  timestamps: true 
});

// ייצוא המודל לשימוש בפרויקט
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
module.exports = Customer;
