const mongoose = require('mongoose');
const { COLLECTION_NAME, KitStatusEnum } = require('../../consts');

const kitLogSchema = new mongoose.Schema({
    kit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.KIT,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.USER,
        required: true
    },
    old_status: {
        type: String,
        enum: Object.values(KitStatusEnum),
        default: KitStatusEnum.NEW,
        required: true,
    },
    new_status: {
        type: String,
        enum: Object.values(KitStatusEnum),
        default: KitStatusEnum.NEW,
        required: true,
    },
    comment: { type: String },
    created_at: { type: Date, default: Date.now() },
    is_deleted: { type: Boolean, default: false },
})

const KitLog = mongoose.model('KitLog', kitLogSchema);
module.exports = KitLog;