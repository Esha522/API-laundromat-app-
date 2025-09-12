const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
   customerName: {           
    type: String,
    required: true
  },
  timeSlot: {
    type: String, // Example: "2:00 PM - 3:00 PM"
    required: true
  },
  address: {
    type: String,
    required: true
  },
  printedLabel: {
    type: Boolean,
    default: false
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Dispatched', 'Delivered'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Logistics', logisticsSchema);

