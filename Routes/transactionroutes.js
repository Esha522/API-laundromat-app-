const express = require('express');
const router = express.Router();
const {createTransaction, getAllTransactions, getTransactionById } = require('../Controllers/transaction');
const { protect, admin } = require('../middleware/auth');


router.post('/create', protect , admin, createTransaction);
router.get('/', protect, admin, getAllTransactions);
router.get('/:orderId', protect, admin , getTransactionById);

module.exports = router;
