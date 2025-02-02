const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// User Management
router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsers);
router.patch('/users/:userId/toggle', isAuthenticated, isAdmin, adminController.toggleUserStatus);

// Wager Management
router.get('/wagers', isAuthenticated, isAdmin, adminController.getAllWagers);
router.post('/wagers/declare', isAuthenticated, isAdmin, adminController.declareOutcome);

module.exports = router;
