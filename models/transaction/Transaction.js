const { COLLECTION_NAME } = require('../../consts')

const mongoose = require('mongoose')
const transactionSchema = new mongoose.Schema({
    balance: { type: Number, default: 0 },
    balance_total: { type: Number, default: 0 },
    transactions: [
        {
            type: { type: String, required: true },
            amount: { type: Number, required: true },
            balance_old: { type: Number, required: true },
            balance_new: { type: Number, required: true },
            purchase_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.PURCHASE },
            payout_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.PAYOUT },
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.USER },
            created_at: { type: Date, default: Date.now },
        },
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
});

const Transaction = mongoose.model(COLLECTION_NAME.TRANSACTION, transactionSchema);
module.exports = Transaction;
