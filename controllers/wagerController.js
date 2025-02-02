const Wager = require('../models/Wager');
const User = require('../models/User');

// 1️⃣ Create Wager
exports.createWager = async (req, res) => {
    const { amount, condition } = req.body;
    const creator = req.user.id;

    try {
        const wager = new Wager({ creator, amount, condition });
        await wager.save();
        res.status(201).json({ message: 'Wager created successfully', wager });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create wager', error: error.message });
    }
};

// 2️⃣ Join Wager
exports.joinWager = async (req, res) => {
    const { wagerId } = req.body;
    const userId = req.user.id;

    try {
        const wager = await Wager.findById(wagerId);
        if (!wager || wager.status !== 'open') {
            return res.status(400).json({ message: 'Wager not available' });
        }

        wager.participants.push(userId);
        await wager.save();
        res.status(200).json({ message: 'Joined wager successfully', wager });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join wager', error: error.message });
    }
};

// 3️⃣ Declare Outcome (Admin Only)
exports.declareOutcome = async (req, res) => {
    const { wagerId, outcome } = req.body;

    try {
        const wager = await Wager.findById(wagerId);
        if (!wager) {
            return res.status(404).json({ message: 'Wager not found' });
        }

        wager.outcome = outcome;
        wager.status = 'completed';
        await wager.save();

        // Distribute winnings (50/50 split for simplicity)
        const winnerId = outcome === 'yes' ? wager.creator : wager.participants[0];

        // Update winner's balance
        const winner = await User.findById(winnerId);
        winner.walletBalance += wager.amount * 2; // Double the bet amount
        await winner.save();

        res.status(200).json({ message: 'Outcome declared and winnings distributed', wager });
    } catch (error) {
        res.status(500).json({ message: 'Failed to declare outcome', error: error.message });
    }
};

// 4️⃣ Get All Wagers
exports.getAllWagers = async (req, res) => {
    try {
        const wagers = await Wager.find().populate('creator participants', 'name email');
        res.status(200).json(wagers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch wagers', error: error.message });
    }
};
