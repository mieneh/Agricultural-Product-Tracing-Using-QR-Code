const express = require('express'); 
const router = express.Router();
const connectionController = require('../controllers/ConnectionController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/transporter', authenticateToken, connectionController.getConnectionsWithProducer);
router.get('/producer', authenticateToken, connectionController.getConnectionsWithTransporter);
router.post('/send-transporter', authenticateToken, connectionController.createConnectionWithProducer);
router.post('/send-producer', authenticateToken, connectionController.createConnectionWithTransporter);
router.put('/accept-reject/:id', authenticateToken, connectionController.updateConnectionStatus);
router.delete('/cancel/:id', authenticateToken, connectionController.cancelConnectionRequest);

module.exports = router;