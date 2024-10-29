const mongoose = require('mongoose')
const { COLLECTION_NAME, CartStatusEnum } = require('../../consts')

const cartSchema = new mongoose.Schema({
    cart_no: { type: String, required: true, unique: true, index: true },
    status: {
        type: String,
        enum: CartStatusEnum,
        default: CartStatusEnum.NEW,
        required: true,
    },
    price_paid: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product_type: {
        type: String,
        enum: ['kit', 'lab', 'combo'],
        required: true
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.USER, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
})

const Cart = mongoose.model(COLLECTION_NAME.CART, cartSchema);
module.exports = Cart;
