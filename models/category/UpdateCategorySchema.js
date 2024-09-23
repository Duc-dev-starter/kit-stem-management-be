const mongoose = require('mongoose');

const updateCategorySchema = new mongoose.Schema({
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
    }
})

const validateUpdateCategory = (data) => {
    const instance = new mongoose.Document(data, updateCategorySchema);
    return instance.validate();
};

module.exports = validateUpdateCategory;