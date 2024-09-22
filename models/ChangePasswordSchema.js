const mongoose = require('mongoose');

const changePasswordSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    old_password: {
        type: String,
        required: true,
        minLength: 6,
    },
    new_password: {
        type: String,
        required: true,
        minLength: 6,
    },
});

const ChangePassword = mongoose.model('ChangePassword', changePasswordSchema);
module.exports = ChangePassword;