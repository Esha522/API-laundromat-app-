const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {getCoupons, createCoupon} = require ('../Controllers/coupons');

router.get('/', protect, admin, getCoupons )
router.post('/create', protect, admin, createCoupon )

module.exports = router;
