const { HttpStatus } = require("../consts");
const { formatResponse } = require("../utils");

const clientController = {
    getKits: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await clientService.getKits(model, req.user);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    getKit: async (req, res, next) => {
        try {
            const kit = await clientService.getKitDetail(req.params.id, req.user);
            res.status(HttpStatus.Success).json(formatResponse(kit));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = clientController;