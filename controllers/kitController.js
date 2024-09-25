const { HttpStatus } = require("../consts");
const { kitService } = require("../services");
const { formatResponse } = require("../utils");

const kitController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const newKit = await kitService.create(model, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(newKit));
        } catch (error) {
            next(error);
        }
    },

    getKits: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await kitService.getKits(model, req.user);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    getKit: async (req, res, next) => {
        try {
            const model = req.body;
            const kit = await kitService.getKit(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(kit));
        } catch (error) {
            next(error);
        }
    },

    changeStatusKit: async (req, res, next) => {
        try {
            const model = req.body;
            const item = await kitService.changeStatusKit(model, req.user);
            res.status(HttpStatus.Success).json(formatResponse(item));
        } catch (error) {
            next(error);
        }
    },

    updateKit: async (req, res, next) => {
        try {
            const model = req.body;
            const kit = await kitService.updateKit(req.params.id, model, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(kit));
        } catch (error) {
            next(error)
        }
    },

    deleteKit: async (req, res, next) => {
        try {
            await kitService.deleteKit(req.params.id, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = kitController;