const express = require('express');
const router = express.Router();
const Notification = require('../Models/notificationmodel');
const moment = require('moment');

router.get('/', async (req, res) => {
  try {
    const range = req.query.range || "all";

    let query = {};

    if (range !== "all") {
      let startDate, endDate;

      if (range === "today") {
        startDate = moment().startOf("day");
        endDate = moment().endOf("day");
      } else if (range === "week") {
        startDate = moment().startOf("isoWeek");
        endDate = moment().endOf("isoWeek");
      } else if (range === "month") {
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");
      }

      query.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    console.log(`Fetched ${notifications.length} notifications for range: ${range}`);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to get notifications' });
  }
});

module.exports = router;
