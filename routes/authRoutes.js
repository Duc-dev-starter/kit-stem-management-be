const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Define routes for authentication
router.post('/login', authController.login);

module.exports = router;
