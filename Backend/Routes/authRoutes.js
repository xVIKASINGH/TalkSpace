const express = require('express');
const router = express.Router();
const authController = require('../Controllers/UserController');

// Authentication Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/checkAuth', authController.checkAuth);

module.exports = router;