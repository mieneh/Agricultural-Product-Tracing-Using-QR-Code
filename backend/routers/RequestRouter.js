const express = require('express');
const router = express.Router();
const requestController = require('../controllers/RequestController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, requestController.getAllRequests);
router.get('/:id', authenticateToken, requestController.getRequestById);
router.post('/send', authenticateToken, requestController.sendRequest);
router.put('/accept/:id', authenticateToken, requestController.acceptRequest);
router.post('/assign-transporter', authenticateToken, requestController.assignTransporter);
router.put('/:id', authenticateToken, requestController.updateRequestStatus);

module.exports = router;