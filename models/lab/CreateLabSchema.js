const mongoose = require('mongoose');
const { LabStatus, LabStatusEnum, COLLECTION_NAME } = require('../../consts');

const createLabSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.CATEGORY,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(LabStatus),
        default: LabStatusEnum.NEW,
        required: true,
    },
    lab_url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        requird: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    max_support_count: {
        type: Number,
        default: 5,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
})

const validateCreateLab = (data) => {
    const instance = new mongoose.Document(data, createLabSchema);
    return instance.validate();
};

module.exports = validateCreateLab;