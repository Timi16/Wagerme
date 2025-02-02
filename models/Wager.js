const mongoose = require('mongoose');

const wagerSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    amount: { type: Number, required: true },
    condition: { type: String, required: true }, // Example: "Will it rain tomorrow?"
    status: { type: String, enum: ['open', 'closed', 'completed'], default: 'open' },
    outcome: { type: String, enum: ['yes', 'no', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wager', wagerSchema);
