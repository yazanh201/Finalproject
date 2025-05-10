const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  status: {
    type: String,
    default: 'פתוחה'
  }
}, {
  timestamps: true,
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
