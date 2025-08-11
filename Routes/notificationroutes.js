const express = require('express');
const router = express.Router();
const Notification = require('../Models/notificationmodel');

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to get notifications' });
  }

});

module.exports = router;
