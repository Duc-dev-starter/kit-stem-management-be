const mongoose = require('mongoose')

const updateUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    phone_number: {
        type: String
    },
    avatar: {
        type: String
    },
    dob: {
        type: Date
    }
})

const validateUpdateUser = (data) => {
    const instance = new mongoose.Document(data, updateUserSchema);
    return instance.validate();
};
module.exports = validateUpdateUser