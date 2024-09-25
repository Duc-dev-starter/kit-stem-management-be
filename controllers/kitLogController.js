const { HttpStatus } = require("../consts");
const { kitLogService } = require("../services");
const { formatResponse } = require("../utils");

const kitLogController = {
    getKitLogs: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await kitLogService.getKitLogs(model, req.user.role);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = kitLogController;