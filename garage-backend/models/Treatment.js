const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  treatmentNumber: Number,
  treatmentId: String,
  date: String,
  cost: Number,
  carPlate: String,
  invoiceFile: String,
  description: String,
  treatmentType: String,
  workerName: String,
  customerName: String,
  images: [String],
  repairTypeId: Number,

  // ✅ חדש: סטטוס
  status: {
    type: String,
    enum: ['בטיפול', 'הסתיים','ממתין לחלקים','בעיכוב'],
    default: 'בטיפול'
  }

}, {
  timestamps: true
});

const Treatment = mongoose.model("Treatment", treatmentSchema);
module.exports = Treatment;
