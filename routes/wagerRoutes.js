const express = require('express');
const router = express.Router();
const wagerController = require('../controllers/wagerController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

router.post('/create', isAuthenticated, wagerController.createWager);
router.post('/join', isAuthenticated, wagerController.joinWager);
router.post('/declare', isAuthenticated, isAdmin, wagerController.declareOutcome);
router.get('/all', isAuthenticated, wagerController.getAllWagers);

module.exports = router;

