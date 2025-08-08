const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Resolved', 'Processing', 'Cancelled'], default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
