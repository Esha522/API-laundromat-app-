const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  cardNumber: String,
  expiryMonth: String,
  expiryYear: String,
  cardType: String, 
});

module.exports = mongoose.model('Card', cardSchema);
