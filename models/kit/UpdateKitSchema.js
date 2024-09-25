const mongoose = require('mongoose');
const { KitStatusEnum, COLLECTION_NAME } = require('../../consts');

const updateKitSchema = new mongoose.Schema({
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
        enum: Object.values(KitStatusEnum),
        default: KitStatusEnum.NEW,
        required: true,
    },
    video_url: {
        type: String,
        required: [
            function () {
                return !this.image_url;
            },
            'Please enter video_url url for course!',
        ],
    },
    image_url: {
        type: String,
        required: [
            function () {
                return !this.video_url;
            },
            'Please enter image_url url for course!',
        ],
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

const validateUpdateKit = (data) => {
    const instance = new mongoose.Document(data, updateKitSchema);
    return instance.validate();
};

module.exports = validateUpdateKit;