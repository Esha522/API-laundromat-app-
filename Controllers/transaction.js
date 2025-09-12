const Transaction = require('../Models/transactionmodel');
const Order = require("../Models/ordermodel");
const createNotification = require('./notification');

// Create Transaction
exports.createTransaction = async (req, res) => {
  try {
    const { orderId, customerId, amountDue, paymentMethod, paymentStatus, datePaid } = req.body;

    const order = await Order.findById(orderId).populate("customer", "customerId name");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const transaction = await Transaction.create({
      orderId: order._id,
      customer: order.customer._id,           // ObjectId for joins
      customerId: order.customer.customerId,  // business ID string
      customerName: order.customer.name,
      amountDue,
      paymentMethod,
      paymentStatus,
      datePaid
    });

    if (paymentStatus === "Paid") {
      await createNotification({
        type: "payment_received",
        title: "Payment Received",
        description: `$${amountDue} received for Order #${orderId} (${order.customer.name}). Marked as paid.`,
        orderId: orderId,
        statusLabel: "Payment Received",
      });
    } else if (paymentStatus === "Failed") {
      await createNotification({
        type: "payment_failed",
        title: "Payment Failed",
        description: `Card declined for Order #${orderId} (${order.customer.name}). Payment not processed.`,
        orderId: orderId,
        statusLabel: "Payment Failed",
      });
    }


    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }



};


// GET All Transactions (with optional filters)
exports.getAllTransactions = async (req, res) => {
  try {
    const { orderId, date } = req.query;

    const filter = {};

    if (orderId) {
      filter.orderId = orderId;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.datePaid = { $gte: start, $lt: end };
    }

    const transactions = await Transaction.find(filter)
      .select('orderId customerName datePaid amountDue paymentMethod paymentStatus');
    ;

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};


//get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const transactions = await Transaction.find({ orderId });
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this order ID' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Failed to fetch transaction' });
  }
};


