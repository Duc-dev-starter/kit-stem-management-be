const mongoose = require('mongoose');
const { UserRole, UserRoleEnum } = require('../consts');

const searchUserSchema = new mongoose.Schema({
    keyword: {
        type: String
    },
    role: {
        type: String,
        enum: UserRole,
        default: UserRoleEnum.ALL
    },
    status: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const SearchUser = mongoose.model('SearchUser', searchUserSchema);
module.exports = SearchUser;