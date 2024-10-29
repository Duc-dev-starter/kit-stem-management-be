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
    },

    getCart: async (req, res, next) => {
        try {
            const item = await cartService.getCart(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(item));
        } catch (error) {
            next(error);
        }
    },

    updateStatusCart: async (req, res, next) => {
        try {
            const model = req.body;
            await cartService.updateStatusCart(model, req.user);
            res.status(HttpStatus.Created).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },

    deleteCart: async (req, res, next) => {
        try {
            await cartService.deleteCart(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = cartController;