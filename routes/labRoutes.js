const { UserRoleEnum } = require('../consts');
const { labController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');
const { validateCreateLab, validateAddSupporters, validateUp, validateUpdateLab, validateSearchLab } = require('../models');

const router = require('express').Router();

// POST domain:/api/lab/create -> Create new item
router.post(
    '/create',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateCreateLab),
    labController.create,
);

// POST domain:/api/kit/search -> Get all items
router.post('/search',
    validationMiddleware(validateSearchLab),
    labController.getLabs,
);

// GET domain:/api/lab/:id -> Get item by id
router.get(`/:id`, authMiddleWare([UserRoleEnum.MANAGER]), labController.getLab);

// POST domain:/api/lab/add-supporter -> add supporter
router.post(
    '/add-supporter',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateAddSupporters),
    labController.addSupporters,
);

// POST domain:/api/lab/remove-supporter -> remove supporter
router.post(
    '/remove-supporter',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateAddSupporters),
    labController.removeSupporters,
);

// POST domain:/api/lab/:id -> Update item logic
router.put('/:id',
    authMiddleWare([UserRoleEnum.MANAGER]),
    validationMiddleware(validateUpdateLab),
    labController.updateLab,
);

// POST domain:/api/delete/:id -> Delete item logic
router.delete('/:id',
    authMiddleWare([UserRoleEnum.MANAGER]),
    labController.deleteLab,
);


router.get('/download/:id', authMiddleWare([UserRoleEnum.CUSTOMER]), labController.download)
module.exports = router;