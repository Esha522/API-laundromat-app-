const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
      customerId: { type: String, unique: true },

  name: String,
  phonenumber: { type: String, unique: true },
  email: { type: String, unique: true },
  gender: String,
  dateOfBirth: Date,
  deliveryMood: String,
  address: String,
  city: String,
  postalCode: String,
  customerType: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  registeredBy: String,
  registeredOn: Date,
}, {
  timestamps: true
});


module.exports = mongoose.model('Customers', customerSchema);
