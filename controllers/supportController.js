const { HttpStatus } = require("../consts");
const { supportService } = require("../services");
const { formatResponse } = require("../utils");

const supportController = {
    requestSupportController: async (req, res, next) => {
        const { labId, customerId, content } = req.body;

        try {
            const newSupport = await supportService.requestSupport(labId, customerId, content);
            res.status(HttpStatus.Success).json(formatResponse(newSupport));
        } catch (error) {
            next(error);
        }
    },

    getLabWithSupportHistoryController: async (req, res, next) => {
        const { staffId, customerId } = req.body;

        try {
            const labWithSupportHistory = await supportService.getLabWithSupportHistory(staffId, customerId);
            res.status(HttpStatus.Success).json(formatResponse(labWithSupportHistory));
        } catch (error) {
            next(error);
        }
    },

    replyToSupportController: async (req, res, next) => {
        const { supportId, staffId, replyContent } = req.body;

        try {
            const updatedSupport = await supportService.replyToSupport(supportId, staffId, replyContent);
            res.status(HttpStatus.Success).json(formatResponse(updatedSupport));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = supportController;