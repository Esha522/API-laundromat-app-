const express = require('express');
const router = express.Router();
const { createLogistics, getAllLogistics, getLogisticsById } = require('../Controllers/logistics');
const { protect, admin } = require('../../../middleware/auth');

router.post('/create', protect, admin, createLogistics);
router.get('/', protect , admin , getAllLogistics);
router.get('/:orderId', protect, admin, getLogisticsById )
module.exports = router;
