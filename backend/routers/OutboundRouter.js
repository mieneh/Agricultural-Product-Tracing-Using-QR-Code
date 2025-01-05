const express = require('express');
const router = express.Router();
const outboundController = require('../controllers/OutboundController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, outboundController.getOutbounds);
router.post('/', authenticateToken, outboundController.createOutbound);
router.put('/:id', authenticateToken, outboundController.updateOutbound);
router.delete('/:id', authenticateToken, outboundController.deleteOutbound);

module.exports = router;