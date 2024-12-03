const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getUserProfile);
router.put('/profile', authenticateToken, authController.updateUserProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;