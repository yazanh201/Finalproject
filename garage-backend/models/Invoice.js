// 📁 models/Invoice.js
const mongoose = require("mongoose");

// ✅ סכמה לפריטי החשבונית (שירותים, חלקים וכו')
const invoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },       // שם השירות/המוצר
  category: { type: String },                   // קטגוריה (שירות, הזמנה וכו')
  price: { type: Number, required: true, min: 0 } // מחיר חייב להיות מספר >= 0
});

// ✅ סכמה לחשבונית
const invoiceSchema = new mongoose.Schema({
  treatmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Treatment",
    required: true,
    unique: true
  },
  customerName: { type: String, required: true },
  customerIdNumber: { type: String },
  carPlate: { type: String, required: true },
  items: [invoiceItemSchema],                   // ✅ עכשיו מוגדר כמו שצריך
  total: { type: Number, default: 0 },
  vatAmount: { type: Number, default: 0 },
  totalWithVAT: { type: Number, default: 0 },
  isPaid: {                                     // ✅ שדה סטטוס תשלום
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ ייצוא המודל
module.exports = mongoose.model("Invoice", invoiceSchema);
