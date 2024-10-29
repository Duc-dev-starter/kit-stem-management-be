const { HttpStatus } = require("../consts");
const { cartService } = require("../services");
const { formatResponse } = require("../utils");

const cartController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const item = await cartService.create(model, req.user.id);
            res.status(HttpStatus.Created).json(formatResponse(item));
        } catch (error) {
            next(error);
        }
    },

    getCarts: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await cartService.getCarts(model, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = cartController;