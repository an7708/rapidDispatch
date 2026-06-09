    const jwt = require('jsonwebtoken');
    const Agent = require('../models/Agent.model');

    const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const agent = await Agent.findById(decoded.id);

        if (!agent) {
        return res.status(401).json({
            success: false,
            message: 'Agent not found.',
        });
        }

        req.agent = agent;
        next();
    } catch (error) {
        return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired.',
        });
    }
    };

    module.exports = { protect };