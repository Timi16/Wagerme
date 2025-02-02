const Wager = require('../models/Wager');
const User = require('../models/User');

// ✅ Create Wager
exports.createWager = async (req, res) => {
    const { amount, condition, selectedOption } = req.body;
    const userId = req.header('userId');

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.walletBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance to create wager' });
        }

        if (!['yes', 'no'].includes(selectedOption)) {
            return res.status(400).json({ message: 'Invalid option. Choose "yes" or "no".' });
        }

        await User.updateOne(
            { _id: userId },
            { $inc: { walletBalance: -amount } },
            { runValidators: false }
        );

        const wager = new Wager({
            creator: userId,
            creatorStake: amount,
            creatorOption: selectedOption,
            condition
        });

        await wager.save();
        res.status(201).json({ message: 'Wager created successfully', wager });
    } catch (error) {
        console.error('Wager Creation Error:', error);
        res.status(500).json({ message: 'Failed to create wager', error: error.message });
    }
};

// ✅ Join Wager
exports.joinWager = async (req, res) => {
    const { wagerId, stake, selectedOption } = req.body;
    const userId = req.header('userId');

    try {
        const user = await User.findById(userId);
        const wager = await Wager.findById(wagerId);

        if (!user || !wager) return res.status(404).json({ message: 'User or Wager not found' });
        if (user.walletBalance < stake) {
            return res.status(400).json({ message: 'Insufficient balance to join wager' });
        }

        if (!['yes', 'no'].includes(selectedOption)) {
            return res.status(400).json({ message: 'Invalid option. Choose "yes" or "no".' });
        }

        await User.updateOne(
            { _id: userId },
            { $inc: { walletBalance: -stake } },
            { runValidators: false }
        );

        wager.participants.push({ user: userId, stake, option: selectedOption });
        await wager.save();

        res.status(200).json({ message: 'Joined wager successfully', wager });
    } catch (error) {
        console.error('Join Wager Error:', error);
        res.status(500).json({ message: 'Failed to join wager', error: error.message });
    }
};

// ✅ Declare Outcome (Admin Only)
exports.declareOutcome = async (req, res) => {
    const { wagerId, outcome } = req.body;

    try {
        const wager = await Wager.findById(wagerId);
        if (!wager) return res.status(404).json({ message: 'Wager not found' });

        if (!['yes', 'no'].includes(outcome)) {
            return res.status(400).json({ message: 'Invalid outcome. Choose "yes" or "no".' });
        }

        wager.status = 'completed';
        wager.outcome = outcome;
        await wager.save();

        // Distribute winnings
        const winners = wager.participants.filter(p => p.option === outcome);
        const totalStake = wager.creatorStake + wager.participants.reduce((acc, p) => acc + p.stake, 0);
        const totalWinningStake = winners.reduce((acc, w) => acc + w.stake, 0);

        // Admin handles winnings
        for (const winner of winners) {
            const prize = (winner.stake / totalWinningStake) * totalStake;
            await User.updateOne(
                { _id: winner.user },
                { $inc: { walletBalance: prize } },
                { runValidators: false }
            );
        }

        res.status(200).json({ message: 'Outcome declared successfully', wager });
    } catch (error) {
        console.error('Outcome Declaration Error:', error);
        res.status(500).json({ message: 'Failed to declare outcome', error: error.message });
    }
};

// ✅ Get All Wagers
exports.getAllWagers = async (req, res) => {
    try {
        const wagers = await Wager.find().populate('creator participants.user', 'username walletBalance');
        res.status(200).json({ message: 'All wagers fetched successfully', wagers });
    } catch (error) {
        console.error('Error fetching wagers:', error);
        res.status(500).json({ message: 'Failed to fetch wagers', error: error.message });
    }
};
