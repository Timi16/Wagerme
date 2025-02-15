const express = require('express');
const router = express.Router();
const wagerController = require('../controllers/wagerController'); // Ensure correct path


router.post('/create', wagerController.createWager);
router.post('/join', wagerController.joinWager);
router.post('/declare', wagerController.declareOutcome);
router.get('/all', wagerController.getAllWagers); 

module.exports = router;
