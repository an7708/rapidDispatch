    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const http = require('http');
    const { Server } = require('socket.io');
    const mongoose = require('mongoose');

    const app = express();
    const httpServer = http.createServer(app);

    app.use(cors({
    origin: [
        'https://rapid-dispatch-beryl.vercel.app',
        'https://rapid-dispatch-1hltrdyci-an7708s-projects.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true
    }));
    
    const io = new Server(httpServer, {
    cors: {
        origin: [
        'https://rapid-dispatch-beryl.vercel.app',
        'https://rapid-dispatch-1hltrdyci-an7708s-projects.vercel.app',
        'http://localhost:3000'
        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
    });

    app.set('trust proxy', 1);
    app.use(express.json());

    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected — RapidDispatch'))
    .catch((err) => console.error('MongoDB error:', err.message));

    app.use((req, res, next) => {
    req.io = io;
    next();
    });

    app.use('/api/auth', require('./routes/auth.routes'));
    app.use('/api/tickets', require('./routes/ticket.routes'));

    app.get('/', (req, res) => {
    res.json({ message: 'RapidDispatch Live Ops API running' });
    });

    const ticketLocks = new Map();

    io.on('connection', (socket) => {
    console.log(`Agent connected: ${socket.id}`);
    });

    socket.on('join_dashboard', (agentData) => {
        socket.agentName = agentData.name;
        socket.agentId = agentData.id;

        const currentLocks = {};
        ticketLocks.forEach((lockData, ticketId) => {
        currentLocks[ticketId] = lockData;
        });
        socket.emit('current_locks', currentLocks);
    });

    socket.on('lock_ticket', ({ ticketId, agentName, agentId }) => {
    console.log('LOCK EVENT RECEIVED:', ticketId);
    console.log(`LOCK REQUEST: ${ticketId} by ${agentName}`);
        if (ticketLocks.has(ticketId)) {
        const existingLock = ticketLocks.get(ticketId);
        if (existingLock.socketId !== socket.id) {
            socket.emit('lock_rejected', {
            ticketId,
            lockedBy: existingLock.agentName,
            message: `Ticket is already locked by ${existingLock.agentName}`,
            });
            return;
        }
        }

        ticketLocks.set(ticketId, {
        socketId: socket.id,
        agentName,
        agentId,
        lockedAt: new Date(),
        });

        io.emit('ticket_locked', {
            ticketId,
            agentName,
            agentId,
            socketId: socket.id,
            });
            console.log('EMITTED ticket_locked', ticketId);

console.log('EMITTED ticket_locked', ticketId);

    socket.on('unlock_ticket', ({ ticketId }) => {
    console.log('UNLOCK EVENT RECEIVED:', ticketId);

    const lock = ticketLocks.get(ticketId);
        if (lock && lock.socketId === socket.id) {
        ticketLocks.delete(ticketId);
        console.log('EMITTED ticket_unlocked', ticketId);
        io.emit('ticket_unlocked', { ticketId });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Agent disconnected: ${socket.id}`);
        ticketLocks.forEach((lockData, ticketId) => {
        if (lockData.socketId === socket.id) {
            ticketLocks.delete(ticketId);
            io.emit('ticket_unlocked', { ticketId });
        }
        });
    });
    });

    app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
    });

    app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
    });

    const PORT = process.env.PORT || 5002;
    httpServer.listen(PORT, () => {
    console.log(`RapidDispatch server running on port ${PORT}`);
    });