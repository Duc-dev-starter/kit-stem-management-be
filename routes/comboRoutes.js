const { UserRoleEnum } = require('../consts');
const { comboController } = require('../controllers');
const { validationMiddleware, authMiddleWare } = require('../middleware');
const { validateCreateCombo, validateSearchCombo } = require('../models');

const router = require('express').Router();

// POST domain:/api/combo/create -> Create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateCreateCombo),
    comboController.createCombo,
);

router.post('/search', authMiddleWare([UserRoleEnum.MANAGER]), validationMiddleware(validateSearchCombo), comboController.getCombos);

router.get(
    '/:id',
    authMiddleWare([UserRoleEnum.MANAGER]),
    comboController.getCombo,
);

module.exports = router