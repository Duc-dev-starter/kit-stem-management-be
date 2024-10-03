const mongoose = require('mongoose');
const { KitStatusEnum, KitStatus } = require('../../consts');

const createKitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: Object.values(KitStatus),
        default: KitStatusEnum.NEW,
        required: true,
    },
    video_url: {
        type: String
    },
    image_url: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
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

const validateCreateKit = (data) => {
    const instance = new mongoose.Document(data, createKitSchema);
    return instance.validate();
};

module.exports = validateCreateKit;