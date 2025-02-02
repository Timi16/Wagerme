const Wager = require('../models/Wager');
const User = require('../models/User');

// 1️⃣ Create Wager
exports.createWager = async (req, res) => {
    const { amount, condition } = req.body;
    const userId = req.user.id;

    try {
        const User = require('../models/User');
        const user = await User.findById(userId);

        if (user.walletBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance to create wager' });
        }

        // Deduct the amount from the user's wallet
        user.walletBalance -= amount;
        await user.save();

        const wager = new Wager({
            creator: userId,
            creatorStake: amount,
            condition
        });
        await wager.save();

        res.status(201).json({ message: 'Wager created successfully', wager });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create wager', error: error.message });
    }
};


// 2️⃣ Join Wager
exports.joinWager = async (req, res) => {
    const { wagerId, stake } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        const wager = await Wager.findById(wagerId);

        if (!wager || wager.status !== 'open') {
            return res.status(400).json({ message: 'Wager not available' });
        }

        if (user.walletBalance < stake) {
            return res.status(400).json({ message: 'Insufficient balance to join wager' });
        }

        // Deduct stake from participant's wallet
        user.walletBalance -= stake;
        await user.save();

        wager.participants.push({ user: userId, stake });
        await wager.save();

        res.status(200).json({ message: 'Joined wager successfully', wager });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join wager', error: error.message });
    }
};

// 3️⃣ Declare Outcome
exports.declareOutcome = async (req, res) => {
    const { wagerId, outcome } = req.body;

    try {
        const wager = await Wager.findById(wagerId).populate('creator participants.user');

        if (!wager) {
            return res.status(404).json({ message: 'Wager not found' });
        }

        if (wager.status !== 'open') {
            return res.status(400).json({ message: 'Wager already completed' });
        }

        wager.outcome = outcome;
        wager.status = 'completed';

        // Calculate total pot
        const totalPot = wager.creatorStake + wager.participants.reduce((sum, p) => sum + p.stake, 0);

        // Determine the winner
        const winner = outcome === 'yes' ? wager.creator : wager.participants[0]?.user;

        if (winner) {
            winner.walletBalance += totalPot;
            await winner.save();
        }

        await wager.save();

        res.status(200).json({ message: 'Outcome declared and winnings distributed', wager });
    } catch (error) {
        res.status(500).json({ message: 'Failed to declare outcome', error: error.message });
    }
};
