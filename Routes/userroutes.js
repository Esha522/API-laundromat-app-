const express = require('express');
const {getAllUsers, getUserProfile, getUserById} = require ('../Controllers/user')
const { protect, admin } = require('../middleware/auth'); 

const router = express.Router();

router.get ('/', protect,admin, getAllUsers );
router.get('/userbyID/:id', protect, admin, getUserById);


module.exports = router;
