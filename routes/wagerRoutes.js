const express = require('express');
const router = express.Router();
const wagerController = require('../controllers/wagerController'); // Ensure correct path

// ✅ Wager Routes
router.post('/create', wagerController.createWager);
router.post('/join', wagerController.joinWager);
router.post('/declare', wagerController.declareOutcome);
router.get('/all', wagerController.getAllWagers); // ✅ New route to get all wagers

module.exports = router;
