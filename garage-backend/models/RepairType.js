const mongoose = require("mongoose");

const repairTypeSchema = new mongoose.Schema({
  repairId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: ""
  },
  description: String,
  treatmentId: {
    type: Number, // מספר מזהה של טיפול
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("RepairType", repairTypeSchema);
