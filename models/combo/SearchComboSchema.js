const mongoose = require('mongoose');

const searchComboSchema = new mongoose.Schema({
    keyword: {
        type: String,
        default: ''
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateSearchCombo = (data) => {
    const instance = new mongoose.Document(data, searchComboSchema);
    return instance.validate();
};

module.exports = validateSearchCombo;