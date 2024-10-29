const { UserRoleEnum } = require('../consts');
const { blogController, cartController } = require('../controllers');
const { validationMiddleware, authMiddleWare } = require('../middleware');
const { validateCreateBlog, validateSearchBlog, validateUpdateBlog } = require('../models');
const { validateCreateCart, validateSearchCart } = require('../models');

const router = require('express').Router();

// POST domain:/api/cart/create -> Create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    validationMiddleware(validateCreateCart),
    cartController.create,
);

// POST domain:/api/cart/search -> Get all items
router.post(
    '/search',
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    validationMiddleware(validateSearchCart),
    cartController.getCarts
);

// GET domain:/api/cart/:id -> Get item by id
router.get(`/:id`, authMiddleWare(), cartController.getCart);

// PUT domain:/api/cart/:id -> Update item
router.put(`/update-status`,
    authMiddleWare([UserRoleEnum.CUSTOMER]),
    cartController.updateStatusCart,
);

// POST domain:/api/cart/:id -> Delete item logic
router.delete(`/:id`, authMiddleWare([UserRoleEnum.CUSTOMER]), cartController.deleteCart);

module.exports = router;