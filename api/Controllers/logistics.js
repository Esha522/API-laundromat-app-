const Logistics = require('../Models/logisticsmodel');
const Order = require ('../Models/ordermodel');
const createNotification = require ('../Controllers/notification');


// Create logistics entry
exports.createLogistics = async (req, res) => {
  try {
    const { orderId, customerId, timeSlot, address } = req.body;
    const logistics = await Logistics.create({
      orderId,
      customerId,
      timeSlot,
      address
    });

  await createNotification({
    type: 'laundry_ready',
    message: `Laundry is ready for pickup - Order #${orderId}`,
    orderId
  });
  
    res.status(201).json(logistics);
  } catch (error) {
    console.error('Error creating logistics entry:', error);
    res.status(500).json({ message: 'Server error while creating logistics' });
  }

 
};


// Get all logistics records
exports.getAllLogistics = async (req, res) => {
  try {
    const logistics = await Logistics.find()  
      .select('orderId customerId timeSlot address printedLabel') 
    .populate({
        path: 'orderId',
        select: '_id', // or select: 'status' if you want status too
      })
      .populate({
        path: 'customerId',
        select: 'name', // Only include customer name
      });
    res.status(200).json(logistics);
  } catch (error) {
    console.error('Error fetching logistics:', error);
    res.status(500).json({ message: 'Error getting logistics records' });
  }
};


// get logistics by orderId
exports.getLogisticsById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const logistics = await Logistics.find({ orderId });
   if (!logistics || logistics.length === 0) {
      return res.status(404).json({ message: 'No logistics found for this order ID' });
    }

    res.status(200).json(logistics);
  } catch (error) {
    console.error('Error fetching logistics:', error);
    res.status(500).json({ message: 'Failed to fetch logistics' });
  }
};