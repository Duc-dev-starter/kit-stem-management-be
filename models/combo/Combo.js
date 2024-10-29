const mongoose = require('mongoose');
const { COLLECTION_NAME } = require('../../consts');

const comboSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [
        {
            itemType: { type: String, enum: ['kit', 'lab'], required: true },
            itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'items.itemType', required: true }
        }
    ],
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.CATEGORY,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 50,
        required: true
    },
    price: { type: Number, required: true },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Combo = mongoose.model('Combo', comboSchema);
module.exports = Combo;
