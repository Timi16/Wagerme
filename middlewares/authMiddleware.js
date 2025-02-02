const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
    const userId = req.header('userId');
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = user;
    next();
};

const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { isAuthenticated, isAdmin };
