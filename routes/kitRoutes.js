const { UserRoleEnum } = require('../consts');
const { kitController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateCreateKit, validateSearchKit, validateUpdateKit, validateChangeStatusKit } = require('../models');

const router = require('express').Router();

// POST domain:/api/kit/create -> create new item
router.post('/create',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateCreateKit),
    kitController.create,
)

// // POST domain:/api/kit/search -> Get all items
router.post('/search',
    validationMiddleware(validateSearchKit),
    kitController.getKits,
);

// GET domain:/api/kit/:id -> Get item by id
router.get(`/:id`, authMiddleWare([UserRoleEnum.MANAGER]), kitController.getKit);

// POST domain:/api/kit/change-status -> Change status item
router.put('/change-status',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateChangeStatusKit),
    kitController.changeStatusKit,
);

// PUT domain:/api/course/:id -> Update item
router.put(`/:id`,
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateUpdateKit),
    kitController.updateKit,
);

// POST domain:/api/course/:id -> Delete item logic
router.delete(`/:id`,
    authMiddleWare([UserRoleEnum.MANAGER]),
    kitController.deleteKit,
);

module.exports = router;