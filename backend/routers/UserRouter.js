const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/reset-password', userController.resetPassword);
router.get('/transporter', userController.getAllTransports);
router.get('/producer', userController.getAllProducers);

module.exports = router;