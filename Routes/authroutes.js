const express = require('express');
const { registerUser } = require('../Controllers/registeruser');
const { loginUser } = require('../Controllers/loginuser');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
