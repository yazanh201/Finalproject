const mongoose = require("mongoose");

/*
  סכמה לעובד (Employee)
  מייצגת פרטי עובד – כולל ת"ז, שם, תפקיד, פרטי קשר, סטטוס ותאריך תחילת עבודה
*/
const employeeSchema = new mongoose.Schema({

  // תעודת זהות של העובד (שדה חובה)
  idNumber: { 
    type: String, 
    required: [true, "תעודת זהות היא שדה חובה"], 
    trim: true 
  },

  // שם מלא של העובד (שדה חובה)
  fullName: { 
    type: String, 
    required: [true, "שם מלא הוא שדה חובה"], 
    trim: true 
  },

  // תפקיד העובד במערכת (לדוג' מנהל, מכונאי) (שדה חובה)
  role: { 
    type: String, 
    required: [true, "תפקיד הוא שדה חובה"], 
    trim: true 
  },

  // כתובת דוא"ל של העובד (שדה חובה)
  email: { 
    type: String, 
    required: [true, "אימייל הוא שדה חובה"], 
    trim: true 
  },

  // מספר טלפון של העובד (שדה חובה)
  phone: { 
    type: String, 
    required: [true, "טלפון הוא שדה חובה"], 
    trim: true 
  },

  // סטטוס העובד (ברירת מחדל: "פעיל")
  status: { 
    type: String, 
    default: "פעיל" 
  },

  // תאריך תחילת עבודה (ברירת מחדל: תאריך יצירת הרשומה)
  startDate: { 
    type: Date, 
    default: Date.now 
  },

});

// ייצוא המודל לשימוש בפרויקט
module.exports = mongoose.model("Employee", employeeSchema);
