const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },       
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },

  role: { type: String, default: "Staff" },      
  branch: { type: String },                    
  accountStatus: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  profilePhoto: { type: String },

  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
