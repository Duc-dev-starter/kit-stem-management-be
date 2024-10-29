const { UserRoleEnum } = require('../consts');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateSearchPurchase } = require('../models');
const { purchaseController } = require('../controllers');
const router = require('express').Router();

router.post(
    '/search',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateSearchPurchase),
    purchaseController.getPurchases,
);

// POST domain:/api/purchase/search-for-instructor -> Get all items for subscriber
router.post(
    '/purchase-history',
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    validationMiddleware(validateSearchPurchase),
    purchaseController.getPurchases,
);

router.put(
    `/update-status/:id`,
    authMiddleWare([UserRoleEnum.MANAGER, UserRoleEnum.STAFF, UserRoleEnum.CUSTOMER]),
    purchaseController.updatePurchaseStatus,
);


module.exports = router;