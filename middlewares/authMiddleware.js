const isAuthenticated = (req, res, next) => {
    const userId = req.header('userId');

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    req.user = { id: userId };
    next();
};

module.exports = { isAuthenticated };
