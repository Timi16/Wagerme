const express = require('express');
const router = express.Router();
const wagerController = require('../controllers/wagerController'); // Make sure this is correct

const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Check if wagerController is imported correctly
router.post('/create', isAuthenticated, wagerController.createWager);
router.post('/join', isAuthenticated, wagerController.joinWager);
router.post('/declare', isAuthenticated, isAdmin, wagerController.declareOutcome);
router.get('/all', isAuthenticated, wagerController.getAllWagers); // ⚠️ Likely the problematic line

module.exports = router;

