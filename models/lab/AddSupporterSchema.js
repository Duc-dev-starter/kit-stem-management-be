const mongoose = require('mongoose');
const { COLLECTION_NAME } = require('../../consts');

const addSupportersSchema = new mongoose.Schema({
    supporterIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: COLLECTION_NAME.USER,
        validate: {
            validator: function (v) {
                return v && v.length > 0; // Kiểm tra xem mảng có ít nhất một phần tử hay không
            },
            message: props => `${props.path} must have at least one supporterId!`
        },
        required: true
    },
    labId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.LAB,
        required: true
    },
})

const validateAddSupporters = (data) => {
    const instance = new mongoose.Document(data, addSupportersSchema);
    return instance.validate();
};

module.exports = validateAddSupporters;