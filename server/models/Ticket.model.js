const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
{
    title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true,
    },
    description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    },
    status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
    },
    priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    },
    category: {
    type: String,
    enum: ['delivery_missed', 'truck_breakdown', 'double_billing', 'wrong_address', 'other'],
    default: 'other',
    },
    assignedTo: {
    type: String,
    default: null,
    },
    resolution: {
    type: String,
    default: '',
    },
    createdBy: {
    type: String,
    required: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);