const Order = require ('../Models/ordermodel');
const User  = require ('../Models/usermodel');
const Transaction = require ('../Models/transactionmodel');
const Logistics = require ('../Models/logisticsmodel')
const Payment = require('../Models/transactionmodel');
const moment = require ('moment');



exports.getDashboard = async (req, res) => {
  try {
 
    const today = moment().startOf('day').toDate();

    // 1. Total Orders Today
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    // 2. Pending Deliveries
    const pendingDeliveries = await Logistics.countDocuments({ deliveryStatus: 'Pending' });

    // 3. Pending Payments
    const pendingPaymentsAgg = await Payment.aggregate([
  { $match: { paymentStatus: 'Unpaid' } },
  { $group: { _id: null, total: { $sum: '$amountDue' } } }
]);

const pendingPayments = pendingPaymentsAgg[0]?.total || 0;

    // 4. Pickups Scheduled
    const pickupsScheduled = await Order.countDocuments({ status: 'Pickup' });

    // 5. Payments Collected
    const paymentsCollected = await Transaction.countDocuments({ paymentStatus: 'Paid' });

    // 6. New Registrations Today
    const newRegistrations = await User.countDocuments({ createdAt: { $gte: today } });

    // 7. Records for Table
    const recentOrders = await Order.find()
      .populate('user', 'name') 
      .sort({ createdAt: -1 })
      .lean();

    const formattedRecords = recentOrders.map(order => {
      const totalquantity = Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      :0;

      return{
      orderId: order._id,
      customerName: order.user?.name || 'N/A',
      pickuptime: moment(order.createdAt).format('hh:mm A'),
      quantity: totalquantity,
      serviceType: order.serviceType || 'N/A',
      status: order.status || 'Pending'
    };
    });

    res.json({
      metrics: {
        totalOrders,
        pendingDeliveries,
        pendingPayments: `$${pendingPayments}`,
        pickupsScheduled,
        paymentsCollected,
        newRegistrations
      },
      records: formattedRecords
    });

  } catch (error) {
    console.error('Error in getDashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};