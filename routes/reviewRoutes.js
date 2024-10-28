const { UserRoleEnum } = require('../consts');
const { reviewController } = require('../controllers');
const { authMiddleWare } = require('../middleware');

const router = require('express').Router();
// POST domain:/api/review -> create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    reviewController.create,
);

module.exports = router;