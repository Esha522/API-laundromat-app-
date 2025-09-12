const Coupon = require('../Models/couponsmodel');

// Create new coupon
exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Error creating coupons:', error);
    res.status(500).json({ message: 'Server error while creating coupons' });
  }
};


// Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error('Error creating coupons:', error);
    res.status(500).json({ message: 'Server error while creating coupons' });}
};

