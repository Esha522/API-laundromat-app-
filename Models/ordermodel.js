const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false

    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
   items: [
  {
    serviceType: { type: String, required: true },  
    itemKey: { type: String, required: true },    
    itemName: { type: String, required: true },     
    quantity: { type: Number, required: true },
  },
],

    pickupDate: { type: Date, default: Date.now, required: true },
    deliveryDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Washing", "Delivered", "Pickup", "Pending"],
      default: "Pending",
    },
    couponCode: {
      type: String,
      enum: ["Welcome10", "Bulk", "Membership"],
    },
    discountAmount: { type: Number, default: 0 },   
    discountedPrice: { type: Number, default: 0 }, 
    pricePerPound: { type: Number, default: 1.8 },
    tax: { type: Number, default: 1.0 },
    totalPrice: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Wallet"],
      default: "Cash",
    },
     preferences: {
      dryCleaning: { type: [String], default: [] },
      washFold: { type: [String], default: [] },
      washDryClean: { type: [String], default: [] },
    },
    specialInstructions: { type: String, default: "" },

  },
  { timestamps: true }
);



// calculate totalprice before saving
orderSchema.pre('save', function (next) {
  const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  
  let basePrice = (totalQuantity * this.pricePerPound) + this.tax;
  let discountAmount = 0;

  if (this.couponCode && couponDiscounts[this.couponCode]) {
    const discountRate = couponDiscounts[this.couponCode];
    discountAmount = basePrice * discountRate;
  }

  this.discountAmount = discountAmount;
  this.discountedPrice = basePrice - discountAmount;
  this.totalPrice = this.discountedPrice; 
  next();
});

const couponDiscounts = {
  Welcome10: 0.1, 
  Bulk: 0.15,     
  Membership: 0.2 
};


module.exports = mongoose.model('Order', orderSchema);
