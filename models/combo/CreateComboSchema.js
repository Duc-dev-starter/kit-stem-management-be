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
    price: { type: Number, required: true },
    quantity: {
        type: Number,
        required: true
    },
    image_url: { type: String, required: true },
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

const validateCreateCombo = (data) => {
    console.log(data)
    const instance = new mongoose.Document(data, comboSchema);
    return instance.validate();
};

module.exports = validateCreateCombo;
