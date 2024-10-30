const express = require('express');
const { authMiddleWare } = require('../middleware');
const { UserRoleEnum } = require('../consts');
const { transactionController } = require('../controllers');
const router = express.Router();

router.get('/', authMiddleWare([UserRoleEnum.MANAGER]), transactionController.getTransaction)

module.exports = router;