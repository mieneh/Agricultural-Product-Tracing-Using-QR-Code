const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/SensorController');

router.get('/', sensorController.getSensors);
router.post('/', sensorController.createSensor);
router.post('/check-batch', sensorController.checkTracking);
router.post('/end-batch', sensorController.endTracking);
router.get('/:id', sensorController.getSensorById);

module.exports = router;