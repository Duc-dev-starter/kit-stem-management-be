const User = require('./User');
const validateChangePassword = require('./ChangePasswordSchema');
const validateChangeRole = require('./ChangeRoleSchema');
const validateSearchUser = require('./SearchUserSchema');
const validateUpdateUser = require('./UpdateUserSchema');
const validateStatusUser = require('./ChangeStatusSchema');
const validateRegisterUser = require('./RegisterSchema');

module.exports = {
    User,
    validateChangePassword,
    validateChangeRole,
    validateSearchUser,
    validateUpdateUser,
    validateStatusUser,
    validateRegisterUser
}