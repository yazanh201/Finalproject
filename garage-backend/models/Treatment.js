const mongoose = require("mongoose");

/*
  תת-סכמה עבור שירותי טיפול (Checklist לפי קטגוריות)
  כל קטגוריה כוללת רשימת אפשרויות שנבחרו
*/
const treatmentServiceSchema = new mongoose.Schema({
  category: String,               // שם הקטגוריה (למשל: "מערכת בלמים")
  selectedOptions: [String]      // רשימת אפשרויות שסומנו מתוך הקטגוריה
}, { _id: false });               // אין צורך ב־_id פנימי לכל שירות

/*
  סכמה לטיפול ברכב (Treatment)
  מייצגת טיפול שבוצע או מתבצע לרכב – כולל פירוט, עלות, תמונות, סטטוס, ועוד
*/
const treatmentSchema = new mongoose.Schema({

  // מספר רץ פנימי לטיפול (לצורכי סדר)
  treatmentNumber: Number,

  // מזהה ייחודי לטיפול (כמחרוזת)
  treatmentId: String,

  // תאריך ביצוע הטיפול (מחרוזת)
  date: String,

  // עלות הטיפול
  cost: Number,

  // מספר לוחית רישוי של הרכב
  carPlate: String,

  // שם קובץ חשבונית (אם קיימת)
  invoiceFile: String,

  // תיאור מילולי של הטיפול שבוצע
  description: String,

  // סוג טיפול (אופציונלי, מחרוזת כללית)
  treatmentType: String,

  // שם העובד/טכנאי שביצע את הטיפול
  workerName: String,

  // שם הלקוח
  customerName: String,

  // קבצי תמונה המצורפים לטיפול
  images: [String],

  // מזהה סוג תיקון (משויך לטבלת סוגי תיקונים)
  repairTypeId: Number,

  // רשימת שירותים שבוצעו, מחולקת לפי קטגוריות
  treatmentServices: [treatmentServiceSchema],

  // סטטוס של הטיפול
  status: {
    type: String,
    enum: ['בטיפול', 'הסתיים', 'ממתין לחלקים', 'בעיכוב'],
    default: 'בטיפול'
  },

  // סיבת העיכוב (אם יש)
  delayReason: {
    type: String,
    default: ""
  },

  // תאריך שחרור משוער (אם קיים)
  estimatedReleaseDate: {
    type: Date,
    default: null
  }

}, {
  // מוסיף שדות createdAt ו־updatedAt אוטומטית
  timestamps: true
});

// יצירת המודל וייצואו
const Treatment = mongoose.model("Treatment", treatmentSchema);
module.exports = Treatment;
