const User = require("../Models/usermodel");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // hide password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (req.file) {
      updates.profilePhoto = `/uploads/${req.file.filename}`; 
 } else {
      delete updates.profilePhoto; 
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    
  console.error("Update Error:", error);   // add this

    res.status(500).json({ message: "Failed to update user details" });
  }
};
