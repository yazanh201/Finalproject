// ייבוא הספרייה mongoose
const mongoose = require('mongoose');

// הגדרת סכמה (Schema) אמיתית עבור לקוח
const customerSchema = new mongoose.Schema({

  // שם הלקוח
  name: {
    type: String,
    required: true,
  },

  // תעודת זהות של הלקוח
  idNumber: {
    type: String,
    required: true,
    unique: true,
  },

  // מספר טלפון
  phone: {
    type: String,
    required: true,
  },

  // כתובת אימייל
  email: {
    type: String,
    required: false,
  },

  // סטטוס הלקוח (פעיל/לא פעיל)
  status: {
    type: String,
    enum: ['פעיל', 'לא פעיל'],
    default: 'פעיל',
  },

  // רכבים ששייכים ללקוח — רשימה של מספרי רכב
  vehicles: [
    {
      type: String,
      ref: 'Vehicle', // קשר הגיוני (לא חובה כרגע)
    }
  ],

}, { timestamps: true }); // מוסיף createdAt ו-updatedAt אוטומטית

// יצירת מודל אמיתי של לקוח
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

// ייצוא המודל החוצה
module.exports = Customer;
