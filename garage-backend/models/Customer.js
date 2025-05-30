const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    match: /^[\u0590-\u05FFa-zA-Z\s]+$/, // עברית/אנגלית בלבד
  },

  idNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{9}$/, // בדיוק 9 ספרות
  },

  phone: {
    type: String,
    required: true,
    match: /^05\d{8}$/, // קידומת חוקית עם 10 ספרות
  },

  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // אימייל תקני
  },

  status: {
    type: String,
    enum: ['פעיל', 'לא פעיל'],
    default: 'פעיל',
  },

  vehicles: [
    {
      type: String,
      ref: 'Vehicle',
      match: /^\d{1,9}$/, // עד 9 ספרות למספר רכב
    }
  ],
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
module.exports = Customer;
