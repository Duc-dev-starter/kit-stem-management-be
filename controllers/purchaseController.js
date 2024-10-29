const { HttpStatus, API_PATH } = require("../consts");
const { purchaseService } = require("../services");
const { formatResponse } = require("../utils");

const purchaseController = {
    getPurchases: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await purchaseService.getPurchases(
                model,
                req.user,
            );
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = purchaseController;