const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/HarvestController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/harvest', harvestController.getAllHarvest);
router.get('/order', authenticateToken, harvestController.getHarvestOrder);

router.get('/', authenticateToken, harvestController.getHarvests);
router.post('/', authenticateToken, harvestController.createHarvest);
router.put('/:id', authenticateToken, harvestController.updateHarvest);
router.delete('/:id', authenticateToken, harvestController.deleteHarvest);
router.get('/:id', harvestController.getHarvestsById);

module.exports = router;