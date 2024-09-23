const mongoose = require('mongoose');

const changePasswordSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    old_password: {
        type: String,
        required: true,
    },
    new_password: {
        type: String,
        required: true,
        minLength: 6,
    },
});

const validateChangePassword = (data) => {
    const instance = new mongoose.Document(data, changePasswordSchema);
    return instance.validate();
};

module.exports = validateChangePassword;