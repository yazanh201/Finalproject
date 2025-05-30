const mongoose = require('mongoose');

const carOrderSchema = new mongoose.Schema({
  carNumber: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['התקבלה', 'בטיפול', 'הושלמה', 'בוטלה'],
    default: 'התקבלה'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CarOrder', carOrderSchema);
