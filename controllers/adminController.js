const User = require('../models/User');
const Wager = require('../models/Wager');

// 1️⃣ Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

// 2️⃣ Suspend or Activate User
exports.toggleUserStatus = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isSuspended = !user.isSuspended;
        await user.save();

        res.status(200).json({ message: `User ${user.isSuspended ? 'suspended' : 'activated'} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user status', error: error.message });
    }
};

// 3️⃣ Get All Wagers
exports.getAllWagers = async (req, res) => {
    try {
        const wagers = await Wager.find().populate('creator participants', 'name email');
        res.status(200).json(wagers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch wagers', error: error.message });
    }
};

// 4️⃣ Declare Outcome (Admin Only)
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

        // Distribute winnings
        const winnerId = outcome === 'yes' ? wager.creator : wager.participants[0];
        const winner = await User.findById(winnerId);
        winner.walletBalance += wager.amount * 2;
        await winner.save();

        res.status(200).json({ message: 'Outcome declared and winnings distributed', wager });
    } catch (error) {
        res.status(500).json({ message: 'Failed to declare outcome', error: error.message });
    }
};
