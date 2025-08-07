const express = require('express');
const router = express.Router();
const {trackOrder} = require ('../Controllers/trackorder');

router.get('/trackorder', trackOrder);


module.exports = router;