const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  treatmentNumber: Number,
  treatmentId: String,
  appointmentNumber: Number,
  date: String,
  cost: Number,
  carPlate: String,
  invoiceId: String,

  // 🆕 שדות חדשים לפי בקשתך
  description: String,              // תיאור הטיפול
  treatmentType: String,           // סוג טיפול בטקסט
  workerName: String,              // שם העובד שביצע את הטיפול
  customerName: String,            // שם הלקוח
  images: [String],                // כתובות של תמונות (מחרוזות)

  repairTypeId: Number             // מזהה של סוג טיפול (אם צריך לשמור אותו)
}, {
  timestamps: true
});

const Treatment = mongoose.model("Treatment", treatmentSchema);
module.exports = Treatment;
