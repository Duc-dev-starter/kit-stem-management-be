const { UserRoleEnum } = require('../consts');
const { reviewController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateCreateReview } = require('../models');

const router = require('express').Router();
// POST domain:/api/review -> create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    validationMiddleware(validateCreateReview),
    reviewController.create,
);

module.exports = router;