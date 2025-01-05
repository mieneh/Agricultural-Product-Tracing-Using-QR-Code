const express = require('express');
const router = express.Router();
const inboundController = require('../controllers/InboundController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, inboundController.getInbounds);
router.post('/', authenticateToken, inboundController.createInbound);
router.put('/:id', authenticateToken, inboundController.updateInbound);
router.delete('/:id', authenticateToken, inboundController.deleteInbound);

module.exports = router;