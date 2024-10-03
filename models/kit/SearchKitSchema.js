const mongoose = require('mongoose');
const { KitStatus, KitStatusEnum, UserRole } = require('../../consts');

const searchKitSchema = new mongoose.Schema({
    keyword: {
        type: String,
        default: ''
    },
    category_id: {
        type: String,
        enum: Object.values(UserRole),
        default: '',
    },
    status: {
        type: String,
        enum: Object.values(KitStatus),
        default: ''
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateSearchKit = (data) => {
    const instance = new mongoose.Document(data, searchKitSchema);
    return instance.validate();
};

module.exports = validateSearchKit;