const mongoose = require('mongoose');
const { PurchaseStatusEnum, COLLECTION_NAME } = require('../../consts');

const searchPurchaseSchema = new mongoose.Schema({
    purchase_no: { type: String, default: '' },
    status: {
        type: String,
        enum: PurchaseStatusEnum,
        default: PurchaseStatusEnum.NEW,
    },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.CART },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.USER },

    product_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    product_type: {
        type: String,
        enum: ['kit', 'lab', 'combo'],
    },
    is_deleted: { type: Boolean, default: false },
})

const validateSearchPurchase = (data) => {
    const instance = new mongoose.Document(data, searchPurchaseSchema);
    return instance.validate();
};

module.exports = validateSearchPurchase;