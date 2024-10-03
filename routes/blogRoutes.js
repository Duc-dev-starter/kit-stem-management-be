const { UserRoleEnum } = require('../consts');
const { blogController } = require('../controllers');
const { validationMiddleware, authMiddleWare } = require('../middleware');
const { validateCreateBlog, validateSearchBlog, validateUpdateBlog } = require('../models');

const router = require('express').Router();

// POST domain:/api/blog/create -> Create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.ADMIN]),
    validationMiddleware(validateCreateBlog),
    blogController.create,
);

// POST domain:/api/blog/search -> Get all items
router.post('/search',
    authMiddleWare([UserRoleEnum.ADMIN]),
    validationMiddleware(validateSearchBlog),
    blogController.getBlogs,
);

// GET domain:/api/blog/:id -> Get item by id
router.get(`/:id`, authMiddleWare([UserRoleEnum.ADMIN]), blogController.getBlog);

// PUT domain:/api/blog/:id -> Update item
router.put(`/:id`,
    authMiddleWare([UserRoleEnum.ADMIN]),
    validationMiddleware(validateUpdateBlog),
    blogController.updateBlog,
);

// POST domain:/api/blog/:id -> Delete item logic
router.delete(`/:id`, authMiddleWare([UserRoleEnum.ADMIN]), blogController.deleteBlog);

module.exports = router;