const mongoose = require('mongoose');
const { USER_ROLE } = require('../consts');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    google_id: {
        type: String
    },
    password: {
        type: String,
        required: [
            function () {
                return !this.google_id;
            },
            'Please enter your password'
        ]
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        required: true
    },
    status: {
        type: Boolean,
        default: true
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
        type: Date,
        default: Date.now
    },
    verification_token: {
        type: String
    },
    verification_token_expires: {
        type: Date
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    token_version: { type: Number },
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = User;