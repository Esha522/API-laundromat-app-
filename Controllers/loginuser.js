const User = require('../Models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
console.log("Password match:", isMatch);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phonenumber: user.phonenumber,
      role: user.role,
      branch: user.branch,
      accountStatus: user.accountStatus,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      isAdmin: user.isAdmin,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};