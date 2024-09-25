const mongoose = require('mongoose');
const { KitStatusEnum } = require('../../consts');

const searchKitLogSchema = new mongoose.Schema({
    kit_id: {
        type: String,
        required: true
    },
    keyword: {
        type: String,
        default: ''
    },
    old_status: {
        type: String,
        enum: Object.values(KitStatusEnum),
        default: ''
    },
    new_status: {
        type: String,
        enum: Object.values(KitStatusEnum),
        default: ''
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateSearchKitLog = (data) => {
    const instance = new mongoose.Document(data, searchKitLogSchema);
    return instance.validate();
};

module.exports = validateSearchKitLog;