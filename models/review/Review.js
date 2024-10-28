const mongoose = require('mongoose');
const { COLLECTION_NAME } = require('../../consts');

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product_type: {
        type: String,
        enum: ['kit', 'lab', 'combo'],
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
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

const Review = mongoose.model(COLLECTION_NAME.REVIEW, reviewSchema);
module.exports = Review;
