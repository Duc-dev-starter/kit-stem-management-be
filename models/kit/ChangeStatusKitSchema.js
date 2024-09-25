const mongoose = require('mongoose');
const { KitStatusEnum } = require('../../consts');

const changeStatusKitSchema = new mongoose.Schema({
    kit_id: {
        type: String,
        required: true
    },
    new_status: {
        type: String,
        enum: Object.values(KitStatusEnum),
        required: true
    },
    comment: {
        type: String,
    }
});

const validateStatusKit = (data) => {
    const instance = new mongoose.Document(data, changeStatusKitSchema);
    return instance.validate();
};

module.exports = validateStatusKit;
