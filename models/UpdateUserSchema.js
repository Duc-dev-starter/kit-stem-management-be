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

const UpdateUser = mongoose.model('UpdateUser', updateUserSchema);
module.exports = UpdateUser;