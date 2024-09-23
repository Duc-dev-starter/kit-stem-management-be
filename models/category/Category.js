const mongoose = require('mongoose');
const { COLLECTION_NAME } = require('../../consts');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
        required: true
    },
    parent_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.CATEGORY,
        default: null
    },
    created_at: {
        type: Date, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    },
    is_deleted: {
        type: Boolean, default: false
    },
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;