const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  idNumber: { type: String, required: [true, "תעודת זהות היא שדה חובה"], trim: true },
  fullName: { type: String, required: [true, "שם מלא הוא שדה חובה"], trim: true },
  role: { type: String, required: [true, "תפקיד הוא שדה חובה"], trim: true },
  email: { type: String, required: [true, "אימייל הוא שדה חובה"], trim: true },
  phone: { type: String, required: [true, "טלפון הוא שדה חובה"], trim: true },
  status: { type: String, default: "פעיל" }, // אם תרצה להשאיר ברירת מחדל
  startDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
