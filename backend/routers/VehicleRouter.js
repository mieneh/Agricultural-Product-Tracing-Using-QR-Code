const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/VehicleController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, vehicleController.getVehicles);
router.post('/', authenticateToken, vehicleController.createVehicle);
router.put('/:id', authenticateToken, vehicleController.updateVehicle);
router.delete('/:id', authenticateToken, vehicleController.deleteVehicle);

module.exports = router;