const { HttpStatus } = require("../consts");
const { labService } = require("../services");
const { formatResponse } = require("../utils");

const labController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const newLab = await labService.create(model, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(newLab));
        } catch (error) {
            next(error);
        }
    },

    getLabs: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await labService.getLabs(model, req.user);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    getLab: async (req, res, next) => {
        try {
            const lab = await labService.getLab(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(lab));
        } catch (error) {
            next(error);
        }
    },

    addSupporters: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await labService.addSupportersToLab(model);
            res.status(200).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    removeSupporters: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await labService.removeSupportersFromLab(model);
            res.status(200).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    updateLab: async (req, res, next) => {
        try {
            const model = req.body;
            const lab = await labService.updateLab(req.params.id, model, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(lab));
        } catch (error) {
            next(error);
        }
    },

    deleteLab: async (req, res, next) => {
        try {
            await labService.deleteLab(req.params.id, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = labController