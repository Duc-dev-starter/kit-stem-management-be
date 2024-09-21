const express = require('express');
const { authController } = require('../controllers');
const { authMiddleWare } = require('../middleware');

const router = express.Router();

// Define routes for authentication
router.post('/login', authController.login);
router.get('/', authMiddleWare(), authController.getCurrentLoginUser);
router.put('/forgot-password', authController.forgotPassword);
router.get('/logout', authMiddleWare(), authController.logout);

module.exports = router;
