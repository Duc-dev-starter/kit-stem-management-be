const express = require('express');
const { userController } = require('../controllers');
const { authMiddleWare, validationMiddleware } = require('../middleware');

const { validateRegisterUser, validateChangePassword, validateStatusUser, validateChangeRole, validateUpdateUser, validateSearchUser } = require('../models');
const { UserRoleEnum } = require('../consts');

const router = express.Router();

// POST domain:/api/users/register -> Register normal user
router.post('/register', validationMiddleware(validateRegisterUser), userController.register);

// POST domain:/api/users/google -> Register google user
router.post('/google', userController.register);

// POST domain:/api/users/create -> Create normal user by admin
router.post('/create', authMiddleWare([UserRoleEnum.ADMIN]), validationMiddleware(validateRegisterUser), userController.register)

// POST domain:/api/users/search -> Get all users includes params: keyword, status, role
router.post('/search',
    authMiddleWare([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]),
    validationMiddleware(validateSearchUser),
    userController.getUsers,
);

// GET domain:/api/users/:id -> Get user by id
router.get('/:id', authMiddleWare([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.CUSTOMER, UserRoleEnum.STAFF]), userController.getUserById);

// PUT domain:/api/users/change-password -> Change password
router.put('/change-password', authMiddleWare(), validationMiddleware(validateChangePassword), userController.changePassword);

// PUT domain:/api/users/change-status -> Change user status (block/unBlock)
router.put('/change-status',
    authMiddleWare([UserRoleEnum.ADMIN]),
    validationMiddleware(validateStatusUser),
    userController.changeStatus,
);

// PUT domain:/api/users/change-role -> Change user role
router.put("/change-role",
    authMiddleWare([UserRoleEnum.ADMIN]),
    validationMiddleware(validateChangeRole),
    userController.changeRole,
);

// PUT domain:/api/users/:id -> Update user
router.put(`/:id`,
    authMiddleWare(),
    validationMiddleware(validateUpdateUser),
    userController.updateUser,
);

// POST domain:/api/users/:id -> Delete user logic
router.delete(`/:id`, authMiddleWare([UserRoleEnum.ADMIN]), userController.deleteUser);

module.exports = router;
