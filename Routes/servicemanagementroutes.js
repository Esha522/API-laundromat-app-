const express = require('express');
const router = express.Router();
const { createService, getAllServices, deleteService} = require('../Controllers/servicemanagement');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getAllServices);
router.post('/create', protect, admin, createService);
router.delete('/delete/:id', protect, admin, deleteService);

module.exports = router;
