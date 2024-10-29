const mongoose = require('mongoose');
const { COLLECTION_NAME, LabStatusEnum, LabStatus } = require('../../consts');

const labSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        index: true,
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
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(LabStatus),
        default: LabStatusEnum.NEW,
        required: true,
    },
    lab_url: {
        type: String,
        requird: true
    },
    supporters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
        default: [],
        required: true
    }],
    max_support_count: {
        type: Number,
        default: 5,
        required: true
    },
    quantity: {
        type: Number,
        default: 50,
        required: true
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    is_deleted: { type: Boolean, default: false },
    support_histories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.SUPPORT,
        default: []
    }]
})

const Lab = mongoose.model('Lab', labSchema);
module.exports = Lab;