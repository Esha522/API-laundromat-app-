const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  pickupDate: { type: Date, default: Date.now, required: true },
  deliveryDate: { type: Date, default: Date.now },
  serviceType: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    
    enum: ['Washing', 'Delivered', 'Pickup', 'Pending'],
    default: 'Pending',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
