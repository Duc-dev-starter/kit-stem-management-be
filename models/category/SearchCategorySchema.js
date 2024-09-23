const mongoose = require('mongoose');

const searchCategorySchema = new mongoose.Schema({
    keyword: {
        type: String,
        default: ''
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateSearchCategory = (data) => {
    const instance = new mongoose.Document(data, searchCategorySchema);
    return instance.validate();
};

module.exports = validateSearchCategory;