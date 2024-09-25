const mongoose = require('mongoose');

const createKitLogSchema = new mongoose.Schema({
    user_id: {
        type: String,
        requird: true
    },
    kit_id: {
        type: String,
        required: true
    },
    old_status: {
        type: String
    },
    new_status: {
        type: String
    },
    comment: {
        type: String
    },
    create_at: {
        type: String,
        default: new Date()
    },
    is_deleted: {
        type: String,
        default: false
    }
})


const validateCreateKitLog = (data) => {
    const instance = new mongoose.Document(data, createKitLogSchema);
    return instance.validate();
};

module.exports = validateCreateKitLog;