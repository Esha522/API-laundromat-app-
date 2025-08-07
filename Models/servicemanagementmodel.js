const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  turnaroundTime: {
    type: String, // e.g., "24 hours", "2 days"
    required: true
  },
  pricingType: {
    type: String,
    enum: ['Fixed', 'Per Kg', 'Per Item'],
    required: true
  },
  estimatedWeightLimit: {
    type: Number, // in Kg or any defined unit
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);
