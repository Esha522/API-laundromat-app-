const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true },

  name: {type: String, required: true},
  phonenumber: { type: String, required: true, unique: true },
  email: { type: String, required:true, unique: true },
  gender: String,
  dateOfBirth: Date,
  deliveryMood: {type: String, required: true},
  address: {type: String, required: true},
  city: {type: String, required: true},
  postalCode: String,
  customerType: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  registeredBy: {type: String, required: true},
  registeredOn: {type: Date, required: true},
}, {
  timestamps: true
});


module.exports = mongoose.model('Customer', customerSchema);
