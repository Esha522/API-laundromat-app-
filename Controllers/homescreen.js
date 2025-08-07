const Order = require('../Models/ordermodel');
const WalletTransaction = require('../Models/wallettransactionmodel');

exports.getUserHomeData = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Wallet Balance Calculation
    const transactions = await WalletTransaction.find({ user: userId });
    const walletBalance = transactions.reduce((acc, txn) => {
      return txn.type === 'credit' ? acc + txn.amount : acc - txn.amount;
    }, 0);

    // Order Stats
    const totalDeliveries = await Order.countDocuments({ user: userId });
    const pickupRequests = await Order.countDocuments({ user: userId, type: 'Pickup' });
    const inProcess = await Order.countDocuments({
      user: userId,
      status: { $in: ['Washing', 'Drying', 'Ironing', 'Packing'] }
    });    const delivered = await Order.countDocuments({ user: userId, status: 'Delivered' });

    // Get Current Orders (latest 5)
    const currentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderId status createdAt');

    res.json({
      walletBalance,
      totalDeliveries,
      pickupRequests,
      inProcess,
      delivered,
      currentOrders,
    });
  } catch (err) {
    console.error('Error fetching home data:', err);
    res.status(500).json({ message: 'Server error fetching home data' });
  }
};
