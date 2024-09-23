const mongoose = require('mongoose');

const changeStatusSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    }
})

const validateStatusUser = (data) => {
    const instance = new mongoose.Document(data, changeStatusSchema);
    return instance.validate();
};

module.exports = validateStatusUser;