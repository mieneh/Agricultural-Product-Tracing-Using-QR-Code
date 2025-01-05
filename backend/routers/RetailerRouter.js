const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/RetailerController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, retailerController.getRetailers);
router.post('/', authenticateToken, retailerController.createRetailer);
router.put('/:id', authenticateToken, retailerController.updateRetailer);
router.delete('/:id', authenticateToken, retailerController.deleteRetailer);

module.exports = router;