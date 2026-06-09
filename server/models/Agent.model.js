    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');

    const agentSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        trim: true,
        },
        email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        },
        password: {
        type: String,
        required: true,
        select: false,
        },
        role: {
        type: String,
        enum: ['agent', 'supervisor'],
        default: 'agent',
        },
    },
    { timestamps: true }
    );

    agentSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    });

    agentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
    };

    module.exports = mongoose.model('Agent', agentSchema);