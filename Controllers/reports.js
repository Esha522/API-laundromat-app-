const Order = require ('../Models/ordermodel');
const User  = require ('../Models/usermodel');
const Transaction = require ('../Models/transactionmodel');
const Logistics = require ('../Models/logisticsmodel')
const Payment = require('../Models/transactionmodel');

const moment = require ('moment');



// overview metrices
exports.getOverview = async (req, res) => {
  try {
    const today = moment().startOf('day').toDate();

    const [totalOrdersToday, pendingDeliveries, pendingPaymentsAggregate, pickupsScheduled, paymentsCollectedCount, newRegistrations
] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Logistics.countDocuments({ deliveryStatus: 'Pending' }),
     Transaction.aggregate([
     { $match: { paymentStatus: 'Unpaid' } },
     { $group: { _id: null, total: { $sum: '$amountDue' } } }
     ]),
      Order.countDocuments({ status: 'Pickup' }), 
      Transaction.countDocuments({ paymentStatus: 'Paid' }),
      User.countDocuments({ createdAt: { $gte: today } })
    ]);

  const pendingPayments = pendingPaymentsAggregate[0]?.total || 0;

    res.json({
      totalOrdersToday,
      pendingDeliveries,
      pendingPayments,
      pickupsScheduled,
      paymentsCollected: paymentsCollectedCount,
      newRegistrations
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ message: 'Failed to fetch overview metrics' });
  }
};


// top services ordered today
exports.getServicesOrderedToday = async (req, res) => {
  const startOfDay = moment().startOf('day').toDate();
  const endOfDay = moment().endOf('day').toDate();

  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
    { $group: { _id: '$serviceType', orders: { $sum: 1 } } },
    { $sort: { orders: -1 } },
    { $limit: 5 }
  ]);


  res.json(result.map(r => ({ service: r._id, orders: r.orders })));
};


// Unresolved Issues
exports.getUnresolvedIssues = async (req, res) => {
    try {
    const today = new Date();

    const [unpaid, deliveryIssues, delayedPickups] = await Promise.all([
      Transaction.countDocuments({ paymentStatus: 'Unpaid' }),
      Logistics.countDocuments({ deliveryStatus: 'Issue' }),
      Order.countDocuments({
        pickupDate: { $lt: today },
        status: 'Pickup'
      })
    ]);

    res.json({
      unpaidOrders: unpaid,
      deliveryIssues,
      delayedPickups
    });
  } catch (error) {
    console.error('Failed to fetch unresolved issues:', error);
    res.status(500).json({ message: 'Failed to fetch unresolved issues' });
  }
};


// order summary
exports.getOrderSummary = async (req, res) => {
  try {
    const today = moment().startOf('day');
    console.log('Generating order summary from (local):', today.toISOString());

    // Get all today's orders
    const orders = await Order.find({ createdAt: { $gte: today.toDate() } });

    // Format each order's createdAt into exact local time
    const formatted = orders.map(order => {
      const localTime = moment(order.createdAt).utcOffset('+05:00'); // PK time
      const timeLabel = localTime.format('h:mm A'); 
      return { hour: timeLabel, orderId: order._id };
    });

    // Group by exact time and count
    const grouped = formatted.reduce((acc, item) => {
      const time = item.hour;
      acc[time] = acc[time] ? acc[time] + 1 : 1;
      return acc;
    }, {});

    const summary = Object.entries(grouped).map(([hour, orders]) => ({ hour, orders }));

    res.json(summary);
  } catch (err) {
    console.error('Error in getOrderSummary:', err);
    res.status(500).json({ message: 'Server error fetching order summary.' });
  }
};



// 10. Payment Overview
exports.getPaymentOverview = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();

     if (totalPayments === 0) {
      return res.json([]);
    }

    const grouped = await Payment.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);

    const response = grouped.map(item => ({
      method: item._id,
      percentage: ((item.count / totalPayments) * 100).toFixed(1)
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment overview' });
  }
};
