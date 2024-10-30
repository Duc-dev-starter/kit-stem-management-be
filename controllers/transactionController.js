const { HttpStatus } = require("../consts");
const { transactionService } = require("../services");
const { formatResponse } = require("../utils");

const transactionController = {
    getTransaction: async (req, res, next) => {
        try {
            const transaction = await transactionService.getTransaction();
            res.status(HttpStatus.Success).json(formatResponse(transaction));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = transactionController