const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  treatmentNumber: Number,
  treatmentId: String,
  appointmentNumber: Number,
  date: String,
  cost: Number,
  workerId: String,
  typeId: String,
  carPlate: String,
  invoiceId: String,
  repairTypeId: Number  // ✅ קישור לסוג טיפול
}, {
  timestamps: true
});

const Treatment = mongoose.model("Treatment", treatmentSchema);
module.exports = Treatment;
