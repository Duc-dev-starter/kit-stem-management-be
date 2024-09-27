const { categoryController, blogController, clientController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateSearchCategory, validateSearchBlog } = require('../models');

const router = require('express').Router();

// POST domain:/api/client/kit/search -> Get all items
router.post('/kit/search',
    authMiddleWare([], true),
    validationMiddleware(),
    clientController.getKit);

// GET domain:/api/client/kit/:id -> Get kit detail by id
// router.get(`/kit/:id`,
//     authMiddleWare([], true),
//     clientController.getKitDetail,
// );

// POST domain:/api/client/category/search -> Get all category
router.post('/category/search',
    authMiddleWare([], true),
    validationMiddleware(validateSearchCategory),
    categoryController.getCategories,
);

// POST domain:/api/client/blog/search -> Get all blogs
router.post('/blog/search',
    authMiddleWare([], true),
    validationMiddleware(validateSearchBlog),
    blogController.getBlogs,
);

// GET domain:/api/client/blog/:id -> Get blog detail
router.get(`/blog/:id`,
    authMiddleWare([], true),
    blogController.getBlog,
);


module.exports = router;