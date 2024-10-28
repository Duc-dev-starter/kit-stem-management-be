const { HttpStatus } = require("../consts");
const { comboService } = require("../services");
const { formatResponse } = require("../utils");

const comboController = {
    createCombo: async (req, res, next) => {
        try {
            const model = req.body;
            const combo = await comboService.createCombo(model, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(combo));
        } catch (error) {
            next(error);
        }
    },

    getCombos: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await comboService.getCombos(model);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },
}

module.exports = comboController;