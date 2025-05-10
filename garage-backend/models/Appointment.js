const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentNumber: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  carNumber: {
    type: String,
    required: true
  },
  treatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment' // קישור ישיר למסמך בטבלת טיפולים
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
