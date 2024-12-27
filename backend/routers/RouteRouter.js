const express = require('express');
const router = express.Router();
const routeController = require('../controllers/RouteController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, routeController.getRoutes);
router.post('/', authenticateToken, routeController.createRoute);
router.put('/:id', authenticateToken, routeController.updateRoute);
router.delete('/:id', authenticateToken, routeController.deleteRoute);

module.exports = router;