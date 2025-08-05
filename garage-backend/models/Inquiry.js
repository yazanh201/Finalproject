const mongoose = require('mongoose');

/*
  סכמה לפנייה (Inquiry)
  מייצגת טופס יצירת קשר או פנייה מהמשתמש – כולל שם, אימייל, טלפון, תוכן הפנייה וסטטוס
*/
const inquirySchema = new mongoose.Schema({

  // שם הפונה (חובה)
  name: { 
    type: String, 
    required: true 
  },

  // כתובת אימייל של הפונה (חובה)
  email: { 
    type: String, 
    required: true 
  },

  // מספר טלפון (שדה רשות)
  phone: { 
    type: String 
  },

  // תוכן ההודעה או הפנייה (חובה)
  message: { 
    type: String, 
    required: true 
  },

  // סטטוס הטיפול בפנייה (ברירת מחדל: 'פתוחה')
  status: { 
    type: String, 
    default: 'פתוחה' 
  }

}, {
  // תיעוד אוטומטי של createdAt ו־updatedAt
  timestamps: true,
});

// ייצוא המודל לשימוש בפרויקט
module.exports = mongoose.model('Inquiry', inquirySchema);
