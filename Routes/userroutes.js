const express = require('express');
const multer = require('multer');
const { getAllUsers, getUserById, updateUser } = require('../Controllers/user');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // e.g. 169445959.png
  }
});

const upload = multer({ storage });

// routes
router.get('/', protect, admin, getAllUsers);
router.get('/userbyID/:id', protect, admin, getUserById);

// notice we add upload.single('profilePhoto')
router.put('/update/:id', protect, admin, upload.single('profilePhoto'), updateUser);

module.exports = router;
