const mongoose = require('mongoose');

const createBlogSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
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
        type: Boolean
    }
})

const validateCreateBlog = (data) => {
    const instance = new mongoose.Document(data, createBlogSchema);
    return instance.validate();
};

module.exports = validateCreateBlog;