const mongoose = require('mongoose');
const { UserRole } = require('../../consts');
const { UserArr } = require('../../consts');

const changeRoleSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: UserArr
    }
})

const validateChangeRole = (data) => {
    const instance = new mongoose.Document(data, changeRoleSchema);
    return instance.validate();
};

module.exports = validateChangeRole;