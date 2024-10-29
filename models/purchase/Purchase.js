const mongoose = require('mongoose');
const { COLLECTION_NAME, PurchaseStatusEnum } = require('../../consts');

const purchaseSchema = new mongoose.Schema({
    purchase_no: { type: String, required: true, unique: true, index: true },
    status: {
        type: String,
        enum: PurchaseStatusEnum,
        default: PurchaseStatusEnum.NEW,
        required: true,
    },
    price_paid: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.CART, required: true },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product_type: {
        type: String,
        enum: ['kit', 'lab', 'combo'],
        required: true
    },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.USER }, // ID của staff được gán
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.USER, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
});

const Purchase = mongoose.model(COLLECTION_NAME.PURCHASE, purchaseSchema);
module.exports = Purchase;
