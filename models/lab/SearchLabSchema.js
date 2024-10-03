const mongoose = require('mongoose');
const { LabStatus } = require('../../consts');

const searchLabSchema = new mongoose.Schema({
    keyword: {
        type: String,
        default: ''
    },
    category_id: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: Object.values(LabStatus),
        default: '',
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateSearchLab = (data) => {
    const instance = new mongoose.Document(data, searchLabSchema);
    return instance.validate();
};

module.exports = validateSearchLab;