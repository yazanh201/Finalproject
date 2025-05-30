const mongoose = require('mongoose');

// 📚 מודל לרכבים
const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {  // ✅ שונה מ-carNumber ל-vehicleNumber
    type: String,
    required: true,
    unique: true,
  },
  ownerName: {       // ✅ שינוי קטן - מ-owner ל-ownerName
    type: String,
    required: false,
  },
  ownerIdNumber: {   // ✅ שינוי קטן - מ-ownerID ל-ownerIdNumber
    type: String,
    required: false,
  },
  manufacturer: {
    type: String,
    trim: true,
},

  model: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  mileage: {
    type: Number,
    required: false,
    default: 0,
  },
}, {
  timestamps: true,
});

// ⬇️ בדיקה חכמה אם כבר יש מודל קיים
const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
