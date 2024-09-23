const mongoose = require('mongoose');

const updateBlogSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
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
    }
})

const validateUpdateBlog = (data) => {
    const instance = new mongoose.Document(data, updateBlogSchema);
    return instance.validate();
};

module.exports = validateUpdateBlog;