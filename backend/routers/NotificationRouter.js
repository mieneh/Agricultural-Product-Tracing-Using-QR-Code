const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, notificationController.getNotifications);
router.delete('/clear-all', authenticateToken, notificationController.deleteAllNotifications);
router.patch('/mark-all-read', authenticateToken, notificationController.markAllAsRead);
router.delete('/:id', authenticateToken, notificationController.deleteNotification);
router.patch('/:id/read', authenticateToken, notificationController.markAsRead);

module.exports = router;