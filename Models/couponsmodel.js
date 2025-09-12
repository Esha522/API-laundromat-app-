const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    applicableServices: {
      type: [String],
      default: ["All"],
    },
    validity: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    customerType: {
      type: String,
      default: "All",
    },
    status: {
      type: String,
      enum: ["Valid", "Invalid"],
      default: "Valid",
    },
  },
  { timestamps: true }
);
couponSchema.index({ code: 1, status: 1 }, { unique: true });

module.exports = mongoose.model("Coupon", couponSchema);
