const mongoose = require('mongoose');
const { CartStatusEnum } = require('../../consts');

const searchCartSchema = new mongoose.Schema({
    product_id: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: CartStatusEnum,
        default: CartStatusEnum.NEW,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const validateSearchCart = (data) => {
    const instance = new mongoose.Document(data, searchCartSchema);
    return instance.validate();
};

module.exports = validateSearchCart;