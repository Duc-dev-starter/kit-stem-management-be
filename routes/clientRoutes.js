const { categoryController, blogController, clientController, labController, kitController, comboController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateSearchCategory, validateSearchBlog, validateSearchLab, validateSearchKit, validateSearchCombo } = require('../models');

const router = require('express').Router();

// POST domain:/api/client/kit/search -> Get all items

// // POST domain:/api/kit/search -> Get all items
router.post('/kit/search',
    validationMiddleware(validateSearchKit),
    kitController.getKits,
);

// GET domain:/api/kit/:id -> Get item by id
router.get(`/kit/:id`, kitController.getKit);
// POST domain:/api/kit/search -> Get all items
router.post('/lab/search',
    validationMiddleware(validateSearchLab),
    labController.getLabs,
);

// GET domain:/api/lab/:id -> Get item by id
router.get(`/lab/:id`, labController.getLab);

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

router.post('/combo/search', validationMiddleware(validateSearchCombo), comboController.getCombos);

router.get(
    '/combo/:id',
    comboController.getCombo,
);

module.exports = router;