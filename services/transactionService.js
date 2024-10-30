const { Transaction } = require("../models")

const transactionService = {
    getTransaction: async () => {
        const transaction = await Transaction.findOne({});
        return transaction;
    }
}

module.exports = transactionService