const mongoose = require('mongoose');
const { UserRoleEnum, UserRole } = require('../../consts');

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    google_id: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@(gmail\.com|fpt\.edu\.vn)$/.test(v);
            },
            message: props => `${props.value} not a valid email addresss!`
        }
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
        type: String,
        default: ''
    },
    phone_number: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    dob: {
        type: Date,
        default: new Date()
    },
    token_version: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateRegisterUser = (data) => {
    const instance = new mongoose.Document(data, registerSchema);
    return instance.validate();
};
module.exports = validateRegisterUser