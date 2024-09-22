const mongoose = require('mongoose');
const { UserRole } = require('../consts');

const changeRoleSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: UserRole
    }
})

const ChangeRole = mongoose.model('ChangeRole', changeRoleSchema);
module.exports = ChangeRole;