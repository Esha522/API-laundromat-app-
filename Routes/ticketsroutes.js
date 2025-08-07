const express = require('express');
const router = express.Router();
const {submitTicket, getTickets} = require('../Controllers/tickets');


router.post('/submit', submitTicket);
router.get('/:userId', getTickets);

module.exports = router;
