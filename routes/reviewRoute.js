const { UserRoleEnum } = require('../consts');

const router = require('express').Router();
// POST domain:/api/review -> create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    validationMiddleware(CreateReviewDto),
    reviewController.create,
);