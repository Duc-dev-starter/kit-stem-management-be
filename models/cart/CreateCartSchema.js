const mongoose = require('mongoose');
const { CartStatusEnum, COLLECTION_NAME } = require('../../consts');

const cartSchema = new mongoose.Schema({
    cart_no: { type: String, default: '' },
    status: {
        type: String,
        enum: CartStatusEnum,
        default: CartStatusEnum.NEW,
        required: true,
    },
    price_paid: { type: Number },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product_type: {
        type: String,
        enum: ['kit', 'lab', 'combo'],
        required: true
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.USER },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
})

// Hàm kiểm tra dữ liệu đầu vào
const validateCreateCart = (data) => {

    const instance = new mongoose.Document(data, cartSchema);
    return instance.validate();
};

module.exports = validateCreateCart;
