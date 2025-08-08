const Order = require('../Models/ordermodel');
const moment = require('moment');
const createNotification = require ('./notification');

// place order
exports.createOrder = async (req, res) => {
  const { items, pickupDate,deliveryDate, serviceType, address, totalPrice } = req.body;
    const userId = req.params.userId;


  try {
    const newOrder = new Order({
      user: userId,
      items,
      pickupDate,
      deliveryDate,
      serviceType,
      address,
      totalPrice
    });

    const savedOrder = await newOrder.save();

     await createNotification({
      type: 'order_created',
      message: `New order created – Order #${savedOrder._id}`,
      orderId: savedOrder._id
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }

};

  


// get all orders
exports.getallorders = async (req, res) => {
  try {
    const today = moment().startOf('day').toDate();

    const [orders, totalOrdersToday, pendingDeliveries, pickupsScheduled] = await Promise.all([
      Order.find().populate('user', 'name email'),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: 'Pending' }), 
      Order.countDocuments({ status: 'Pickup' }) 
    ]);

    res.json({
      metrics: {
        totalOrdersToday,
        pendingDeliveries,
        pickupsScheduled
      },
      orders
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


// get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};


// update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update fields
    order.items = req.body.items || order.items;
    order.pickupDate = req.body.pickupDate || order.pickupDate;
    order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
    order.serviceType = req.body.serviceType || order.serviceType;
    order.address = req.body.address || order.address;
    order.status = req.body.status || order.status; 

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// delete order
exports.deleteorder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
};



// get incoming orders by admin
exports.getIncomingOrders = async (req, res) => {
  try {
    const incomingOrders = await Order.find({ status: 'Pending' })    
    .select('orderId customerName pickupDate serviceType status items') ;

    res.status(200).json(incomingOrders);
  } catch (error) {
    console.error('Error fetching incoming orders:', error);
    res.status(500).json({ message: 'Server error while fetching incoming orders' });
  }
};
