const mongoose = require('mongoose');
const { UserRole, UserRoleEnum } = require('../consts');

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
        ],
        minLength: 6
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRoleEnum.CUSTOMER,
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