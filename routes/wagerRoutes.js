const express = require('express');
const router = express.Router();
const wagerController = require('../controllers/wagerController'); // Ensure correct path

// ✅ Create a Wager
router.post('/create', wagerController.createWager);

// ✅ Join an Existing Wager
router.post('/join', wagerController.joinWager);

// ✅ Declare Wager Outcome (Admin Only)
router.post('/declare', wagerController.declareOutcome);

// ✅ Get All Wagers
router.get('/all', wagerController.getAllWagers);

// ✅ Get a Single Wager by ID
router.get('/:wagerId', wagerController.getWagerById);

// ✅ Cancel Wager (Only by Creator)
router.post('/cancel', wagerController.cancelWager);

module.exports = router;
