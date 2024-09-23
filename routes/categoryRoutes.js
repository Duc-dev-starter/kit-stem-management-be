const { UserRoleEnum } = require('../consts');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { categoryController } = require('../controllers');
const { validateUpdateCategory, validateSearchCategory, validateCreateCategory } = require('../models');

const router = require('express').Router();

// POST domain:/api/category/create -> create new item
router.post('/create', authMiddleWare([UserRoleEnum.ADMIN]), validationMiddleware(validateCreateCategory), categoryController.create);

// POST domain:/api/category/search -> Get all items
router.post('/search',
    authMiddleWare([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]),
    validationMiddleware(validateSearchCategory),
    categoryController.getCategories,
);

// GET domain:/api/category/:id -> Get item by id
router.get(`/:id`, authMiddleWare([UserRoleEnum.ADMIN]), categoryController.getCategory);

// PUT domain:/api/category/:id -> Update item
router.put(`/:id`,
    authMiddleWare([UserRoleEnum.ADMIN]),
    validationMiddleware(validateUpdateCategory),
    categoryController.updateCategory,
);

// POST domain:/api/category/:id -> Delete item logic
router.delete(`/:id`,
    authMiddleWare([UserRoleEnum.ADMIN]),
    categoryController.deleteCategory,
);

module.exports = router;