const mongoose = require('mongoose');
const { COLLECTION_NAME } = require('../../consts');

const supportSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
        required: true
    },
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
        required: true
    },
    lab_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.LAB,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
});

const Support = mongoose.model(COLLECTION_NAME.SUPPORT, supportSchema);
module.exports = Support;
