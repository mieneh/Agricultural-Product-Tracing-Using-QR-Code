const express = require('express');
const router = express.Router();
const driverController = require('../controllers/DriverController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, driverController.getDrivers);
router.post('/', authenticateToken, driverController.createDriver);
router.put('/:id', authenticateToken, driverController.updateDriver);
router.delete('/:id', authenticateToken, driverController.deleteDriver);

module.exports = router;