const mongoose = require('mongoose');

const updateReviewSchema = new mongoose.Schema({
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
    }
})

const validateUpdateReview = (data) => {
    const instance = new mongoose.Document(data, updateReviewSchema);
    return instance.validate();
};

module.exports = validateUpdateReview;