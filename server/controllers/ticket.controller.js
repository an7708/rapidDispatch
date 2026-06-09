    const Ticket = require('../models/Ticket.model');

    const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

    const createTicket = async (req, res) => {
    try {
        const { title, description, priority, category } = req.body;
        const ticket = await Ticket.create({
        title,
        description,
        priority: priority || 'medium',
        category: category || 'other',
        createdBy: req.agent?.name || 'Unknown Agent',
        });
        req.io.emit('new_ticket', ticket);
        res.status(201).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

    const updateTicket = async (req, res) => {
    try {
        const { status, resolution, assignedTo } = req.body;

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (resolution !== undefined) updateData.resolution = resolution;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

        const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    updateData,
    { returnDocument: 'after', runValidators: true }
    );

        if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        req.io.emit('ticket_updated', ticket);
        res.status(200).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

    module.exports = { getTickets, createTicket, updateTicket };