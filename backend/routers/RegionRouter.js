const express = require('express');
const router = express.Router();
const regionController = require('../controllers/RegionController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, regionController.getRegions);
router.post('/', authenticateToken, regionController.createRegion);
router.put('/:id', authenticateToken, regionController.updateRegion);
router.delete('/:id', authenticateToken, regionController.deleteRegion);

module.exports = router;