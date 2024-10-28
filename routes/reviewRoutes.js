const { UserRoleEnum } = require('../consts');
const { reviewController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateCreateReview, validateUpdateReview } = require('../models');

const router = require('express').Router();
// POST domain:/api/review -> create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    validationMiddleware(validateCreateReview),
    reviewController.create,
);

router.get('/:id', reviewController.getReviewById)

router.put(
    `/:id`,
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    reviewController.updateReview,
);

// POST domain:/api/review/:id -> Delete item logic
router.delete(`/:id`, authMiddleWare([UserRoleEnum.CUSTOMER]), reviewController.deleteReview);

module.exports = router;