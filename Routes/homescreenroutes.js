const express = require('express');
const router = express.Router();
const {getUserHomeData} = require('../Controllers/homescreen');

router.get('/:userId', getUserHomeData )

module.exports = router;
