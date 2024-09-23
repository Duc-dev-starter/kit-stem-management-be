const mongoose = require('mongoose');

const createCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        default: null
    },
    parent_category_id: {
        type: String,
        default: null
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
        type: Boolean,
        default: false
    }
})

const validateCreateCategory = (data) => {
    const instance = new mongoose.Document(data, createCategorySchema);
    return instance.validate();
};

module.exports = validateCreateCategory;