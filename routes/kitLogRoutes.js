const { UserRoleEnum } = require('../consts');
const { kitLogController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateSearchKitLog } = require('../models');

const router = require('express').Router();

// POST domain:/api/kit/log/search -> Get all items
router.post('/search',
    authMiddleWare([UserRoleEnum.MANAGER, UserRoleEnum.STAFF]),
    validationMiddleware(validateSearchKitLog),
    kitLogController.getKitLogs,
);

module.exports = router;