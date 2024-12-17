const express = require('express');
const router = express.Router();
const processController = require('../controllers/ProcessController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, processController.getProcesses);
router.post('/', authenticateToken, processController.createProcess);
router.put('/:id', authenticateToken, processController.updateProcess);
router.delete('/:id', authenticateToken, processController.deleteProcess);

module.exports = router;