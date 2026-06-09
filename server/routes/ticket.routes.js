const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getTickets, createTicket, updateTicket } = require('../controllers/ticket.controller');

router.get('/', protect, getTickets);
router.post('/', protect, createTicket);
router.put('/:id', protect, updateTicket);

module.exports = router;