const mongoose = require('mongoose');

const searchBlogSchema = new mongoose.Schema({
    category_id: {
        type: String,
        default: ''
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateSearchBlog = (data) => {
    const instance = new mongoose.Document(data, searchBlogSchema);
    return instance.validate();
};

module.exports = validateSearchBlog;