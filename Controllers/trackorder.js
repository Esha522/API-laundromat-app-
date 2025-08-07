const Order = require('../Models/ordermodel');
const User = require('../Models/usermodel');

exports.trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.body;

      // Step 1: Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Step 2: Find the user linked to the order
    const user = await User.findOne({ _id: order.user, email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this ID and email' });
    }
    res.status(200).json({
      soapId: user._id,
      date: order.createdAt,
      currentStatus: order.status,
      email: user.email,
    });
  } catch (err) {
    console.error('Error tracking order:', err);
    res.status(500).json({ message: 'Server error while tracking order' });
  }
};
