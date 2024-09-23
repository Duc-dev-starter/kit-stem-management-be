const mongoose = require('mongoose');
const { COLLECTION_NAME } = require('../../consts');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.CATEGORY,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        requird: true
    },
    created_at: {
        type: Date, default: Date.now()
    },
    updated_at: {
        type: Date, default: Date.now()
    },
    is_deleted: {
        type: Boolean, default: false
    },
})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;