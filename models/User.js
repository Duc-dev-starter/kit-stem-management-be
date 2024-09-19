const mongoose = require('mongoose');

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
    video: {
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
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = User;