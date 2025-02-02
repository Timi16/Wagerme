const mongoose = require('mongoose');

const wagerSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creatorStake: { type: Number, required: true }, // Creator's stake
    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            stake: { type: Number, required: true } // Each participant's stake
        }
    ],
    condition: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed', 'completed'], default: 'open' },
    outcome: { type: String, enum: ['yes', 'no', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wager', wagerSchema);
