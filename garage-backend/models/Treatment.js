const mongoose = require("mongoose");

// Subschema for treatment checklist
const treatmentServiceSchema = new mongoose.Schema({
  category: String,
  selectedOptions: [String]
}, { _id: false });

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

  // ✅ NEW: Checklist grouped by categories
  treatmentServices: [treatmentServiceSchema],

  // ✅ Status field
  status: {
    type: String,
    enum: ['בטיפול', 'הסתיים', 'ממתין לחלקים', 'בעיכוב'],
    default: 'בטיפול'
  }

}, {
  timestamps: true
});

const Treatment = mongoose.model("Treatment", treatmentSchema);
module.exports = Treatment;
