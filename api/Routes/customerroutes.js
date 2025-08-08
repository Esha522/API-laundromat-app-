const express = require('express');
const router = express.Router();
const { protect, admin } = require('../../../middleware/auth');
const {getAllCustomers, createCustomer, updateCustomer, deleteCustomer} = require ('../Controllers/customer');

router.get('/', protect, admin, getAllCustomers )
router.post('/add', protect, admin, createCustomer )
router.put('/update/:customerId', protect, admin, updateCustomer)
router.delete('/delete/:customerId', protect, admin, deleteCustomer)

module.exports = router;
