const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

// User Profile
router.get('/profile/:id', authController.getProfile);

module.exports = router;
