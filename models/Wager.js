const mongoose = require('mongoose');

const wagerSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creatorStake: { type: Number, required: true },
    creatorOption: { type: String, enum: ['yes', 'no'], required: true }, // ✅ Yes/No option for creator
    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            stake: { type: Number, required: true },
            option: { type: String, enum: ['yes', 'no'], required: true } // ✅ Yes/No option for participants
        }
    ],
    condition: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed', 'completed'], default: 'open' },
    outcome: { type: String, enum: ['yes', 'no', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wager', wagerSchema);
