const mongoose = require('mongoose');
const { LabStatusEnum, COLLECTION_NAME, LabStatus } = require('../../consts');

const updateLabSchema = new mongoose.Schema({
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
        required: true
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
        required: true
    },
})

const validateUpdateLab = (data) => {
    const instance = new mongoose.Document(data, updateLabSchema);
    return instance.validate();
};

module.exports = validateUpdateLab;