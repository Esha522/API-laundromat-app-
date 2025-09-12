const Order = require("../Models/ordermodel");
const moment = require("moment");
const createNotification = require("./notification");
const Customer = require("../Models/customermodel");

// place order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.user || req.user?.id;
    const {
      customer,
      items,
      pickupDate,
      deliveryDate,
      address,
      paymentMethod,
      couponCode,
      status,
      specialInstructions,
      preferences,
    } = req.body;

    if (!customer || !customer.email || !customer.phonenumber) {
      return res.status(400).json({ message: "Customer details are required" });
    }

    let existingCustomer = await Customer.findOne({
      $or: [{ email: customer.email }, { phonenumber: customer.phonenumber }],
    });

    if (!existingCustomer) {
      const lastCustomer = await Customer.findOne().sort({ createdAt: -1 });
      let newId = "CUST001";
      if (lastCustomer && lastCustomer.customerId) {
        const lastIdNum = parseInt(
          lastCustomer.customerId.replace("CUST", ""),
          10
        );
        const nextIdNum = lastIdNum + 1;
        newId = "CUST" + nextIdNum.toString().padStart(3, "0");
      }

      existingCustomer = new Customer({
        customerId: newId,
        ...customer,
      });
      await existingCustomer.save();
    }

    const newOrder = new Order({
      ...(userId && { user: userId }),
      customer: existingCustomer._id,
      items,
      pickupDate,
      deliveryDate,
      address,
      paymentMethod,
      couponCode,
      status,
      specialInstructions,
      preferences,
    });

    const savedOrder = await newOrder.save();
    const serviceTypes = [...new Set(items.map((i) => i.serviceType))].join(
      ", "
    );

    await createNotification({
      type: "order_created",
      title: "New Order Created",
      description: `Drop-off by ${customer.name} – ${items.length} items (${serviceTypes}). Payment pending.`,
      orderId: savedOrder._id,
      statusLabel: `Order #${savedOrder._id} Created`,
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// get all orders
exports.getallorders = async (req, res) => {
  try {
    const today = moment().startOf("day").toDate();

    const [orders, totalOrdersToday, pendingDeliveries, pickupsScheduled] =
      await Promise.all([
        Order.find()
          .populate("user", "name email")
          .populate("customer", "name phonenumber email"),
        Order.countDocuments({ createdAt: { $gte: today } }),
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Pickup" }),
      ]);

    res.json({
      metrics: {
        totalOrdersToday,
        pendingDeliveries,
        pickupsScheduled,
      },
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("customer", "name phonenumber email address gender");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Server error while fetching order" });
  }
};

// update order
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.params.userId || req.body.user || req.user?.id;

    const {
      customer,
      items,
      pickupDate,
      deliveryDate,
      serviceType,
      address,
      paymentMethod,
      couponCode,
      status,
      preferences,
      specialInstructions,
    } = req.body;

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let existingCustomer = null;
    if (customer && (customer.email || customer.phonenumber)) {
      existingCustomer = await Customer.findOne({
        $or: [{ email: customer.email }, { phonenumber: customer.phonenumber }],
      });

      if (existingCustomer) {
        Object.assign(existingCustomer, customer);
        await existingCustomer.save();
      } else {
        const lastCustomer = await Customer.findOne().sort({ createdAt: -1 });
        let newId = "CUST001";
        if (lastCustomer && lastCustomer.customerId) {
          const lastIdNum = parseInt(
            lastCustomer.customerId.replace("CUST", ""),
            10
          );
          const nextIdNum = lastIdNum + 1;
          newId = "CUST" + nextIdNum.toString().padStart(3, "0");
        }

        existingCustomer = new Customer({
          customerId: newId,
          ...customer,
        });
        await existingCustomer.save();
      }
    }

    // --- update fields ---
    const updates = {
      ...(items && { items }),
      ...(pickupDate && { pickupDate }),
      ...(deliveryDate && { deliveryDate }),
      ...(address && { address }),
      ...(paymentMethod && { paymentMethod }),
      ...(couponCode && { couponCode }),
      ...(serviceType && { serviceType }),
      ...(status && { status }),
      ...(preferences && { preferences }),
      ...(specialInstructions && { specialInstructions }),
      ...(existingCustomer && { customer: existingCustomer._id }),
      ...(userId && { user: userId }),
    };

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
      runValidators: true,
    }).populate("customer");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Order update error:", error.message, error.stack);
    res.status(500).json({ message: "Failed to update order" });
  }
};

// delete order
exports.deleteorder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error while deleting order" });
  }
};

// get incoming orders by admin
exports.getIncomingOrders = async (req, res) => {
  try {
    const incomingOrders = await Order.find({ status: "Pending" })
      .populate("customer", "name phonenumber email")
      .select("_id pickupDate status items");
    res.status(200).json(incomingOrders);
  } catch (error) {
    console.error("Error fetching incoming orders:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching incoming orders" });
  }
};
