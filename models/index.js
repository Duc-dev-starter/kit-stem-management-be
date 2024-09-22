const User = require('./User');
const ChangePasswordSchema = require('./ChangePasswordSchema')
const ChangeStatusSchema = require('./ChangeStatusSchema')
const ChangeRoleSchema = require('./ChangeRoleSchema');
const UpdateUserSchema = require('./UpdateUserSchema');
const SearchUserSchema = require('./SearchUserSchema');

module.exports = {
    User,
    ChangePasswordSchema,
    ChangeStatusSchema,
    ChangeRoleSchema,
    UpdateUserSchema,
    SearchUserSchema
}