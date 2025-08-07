const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  amount: Number,
  type: { type: String, enum: ['credit', 'debit'] },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
