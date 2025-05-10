const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  idNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String },
  email: { type: String },
  phone: { type: String },
  status: { type: String, default: "פעיל" }, // ברירת מחדל
  startDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
