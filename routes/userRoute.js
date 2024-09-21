const express = require('express');
const { userController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const User = require('../models/User');

const router = express.Router();

router.post('/register', validationMiddleware(User), userController.register);
router.get('/:id', authMiddleWare([], true), userController.getUserById);

module.exports = router;
