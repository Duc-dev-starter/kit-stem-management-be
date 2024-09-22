const mongoose = require('mongoose');

const changeStatusSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    }
})

const ChangeStatus = mongoose.model('ChangeStatus', changeStatusSchema);
module.exports = ChangeStatus;