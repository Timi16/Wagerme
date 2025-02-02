const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.post('/deposit', isAuthenticated, walletController.deposit);
router.get('/verify', walletController.verifyPayment);
router.post('/withdraw', isAuthenticated, walletController.withdraw);
router.get('/balance', isAuthenticated, walletController.getBalance);
router.post('/webhook', walletController.handleWebhook);

module.exports = router;
