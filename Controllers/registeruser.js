const User = require('../Models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// register user
exports.registerUser = async (req, res) => {
  const { name, email, phonenumber, password, isAdmin } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, phonenumber, isAdmin, password : hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};