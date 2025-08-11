const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {getDashboard} = require ('../Controllers/dashboard');

router.get('/', protect, admin, getDashboard )
module.exports = router;
