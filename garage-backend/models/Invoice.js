// 📁 models/Invoice.js
const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  treatmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Treatment",
    required: true,
    unique: true
  },
  customerName: String,
  customerIdNumber: String,
  carPlate: String,
  items: [invoiceItemSchema],
  total: Number,
  vatAmount: Number,         // ⬅️ חדש
  totalWithVAT: Number,      // ⬅️ חדש
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Invoice", invoiceSchema);
