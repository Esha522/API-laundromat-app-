const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customerId: {
    type: String,
    ref: 'User',
    required: true
  },
   customerName: {
    type: String, 
    required: true
  },
  amountDue: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Wallet', 'Card', 'Cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Failed'],
    default: 'Unpaid'
  },
  datePaid: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
