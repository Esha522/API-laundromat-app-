const Notification = require('../Models/notificationmodel');

const createNotification = async ({ type, message, orderId }) => {
  try {
    const newNotification = new Notification({ type, message, orderId });
      await newNotification.save();
    console.log('Notification saved:', newNotification); 
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

module.exports = createNotification;
