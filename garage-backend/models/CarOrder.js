const mongoose = require('mongoose');

/*
  סכמה להזמנת רכב (CarOrder)
  מייצגת פרטי הזמנה של רכב – כולל תאריכים, עלות, סטטוס ותיאור
*/
const carOrderSchema = new mongoose.Schema({

  // מספר הרכב שהוזמן
  carNumber: {
    type: String,
    required: true
  },

  // תאריך ההזמנה
  orderDate: {
    type: Date,
    required: true
  },

  // תאריך הצפוי לאספקה
  deliveryDate: {
    type: Date,
    required: true
  },

  // תיאור או פרטים נוספים על ההזמנה
  details: {
    type: String,
    required: true
  },

  // עלות ההזמנה
  cost: {
    type: Number,
    required: true
  },

  // סטטוס ההזמנה (ברירת מחדל: "התקבלה")
  status: {
    type: String,
    enum: ['התקבלה', 'בטיפול', 'הושלמה', 'בוטלה'],
    default: 'התקבלה'
  }

}, {
  // הוספת createdAt ו־updatedAt אוטומטיים
  timestamps: true
});

// ייצוא המודל לשימוש בקוד
module.exports = mongoose.model('CarOrder', carOrderSchema);
