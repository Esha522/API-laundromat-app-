const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {getOverview, getServicesOrderedToday, getUnresolvedIssues, getOrderSummary, getPaymentOverview, getReportsAnalytics} = require ('../Controllers/reports');


// router.get('/overview', protect, admin, getOverview);
// router.get('/servicesorderedtoday', protect, admin, getServicesOrderedToday);
// router.get('/unresolvedissues', protect, admin, getUnresolvedIssues);
// router.get('/ordersummary', protect , admin , getOrderSummary);
// router.get('/paymentoverview', protect, admin, getPaymentOverview);
router.get('/reportanalytics', protect, admin, getReportsAnalytics)

module.exports = router;
