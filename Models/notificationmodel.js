const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type:
  {
    type: String,
    required: true
  },
  title:
  {
    type: String,
    required: true
  },
  description:
  {
    type: String,
    required: true
  },
  statusLabel:
  {
    type: String

  },
  orderId:
  {
    type: mongoose.Schema.Types.ObjectId, ref: "Order"

  },
  read:
  {
    type: Boolean, default: false
  },

}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
