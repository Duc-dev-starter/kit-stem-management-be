const mongoose = require('mongoose');
const { UserRole, UserRoleEnum } = require('../../consts');

const searchUserSchema = new mongoose.Schema({
    keyword: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRoleEnum.CUSTOMER,
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

const validateSearchUser = (data) => {
    const instance = new mongoose.Document(data, searchUserSchema);
    return instance.validate();
};
module.exports = validateSearchUser