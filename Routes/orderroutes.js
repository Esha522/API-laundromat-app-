const express = require('express');
const router = express.Router();
const { createOrder, getallorders, updateOrder, deleteorder, getOrderById, getIncomingOrders} = require('../Controllers/order');
const { protect, admin } = require('../middleware/auth');


router.post('/create/:userId', createOrder);
router.post('/create', createOrder);
router.get('/incoming', protect, admin, getIncomingOrders);
router.get('/', protect, admin, getallorders);
router.put('/update/:id', protect, admin, updateOrder);
router.delete('/delete/:id', protect, admin, deleteorder);
router.get('/:id', protect, getOrderById);




module.exports = router;
