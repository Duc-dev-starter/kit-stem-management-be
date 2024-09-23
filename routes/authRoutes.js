const express = require('express');
const { authController } = require('../controllers');
const { authMiddleWare } = require('../middleware');

const router = express.Router();

// POST domain:/api/auth/login -> Login normal user
router.post('/login', authController.login);

// POST domain:/api/auth/google -> Login via Google
router.post('/google', authController.login);

// GET domain:/api/auth -> Require Login
router.get('/', authMiddleWare(), authController.getCurrentLoginUser);

// PUT domain:/api/auth/forgot-password -> Forgot password
router.put('/forgot-password', authController.forgotPassword);

// GET domain:/api/auth/logout -> Logout user
router.get('/logout', authMiddleWare(), authController.logout);

module.exports = router;
