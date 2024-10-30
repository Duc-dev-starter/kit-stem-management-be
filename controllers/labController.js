const { redisClient } = require("../config");
const { HttpStatus } = require("../consts");
const { labService } = require("../services");
const { formatResponse, createCacheKey } = require("../utils");

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
            const result = await labService.getLabs(model);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    getLab: async (req, res, next) => {
        try {
            const labId = req.params.id;
            const cachedLab = await redisClient.get(`lab:${labId}`);

            if (cachedLab) {
                return res.status(HttpStatus.Success).json(formatResponse(JSON.parse(cachedLab)));
            }
            const lab = await labService.getLab(labId);
            await redisClient.setEx(`lab:${labId}`, 3600, JSON.stringify(lab));
            res.status(HttpStatus.Success).json(formatResponse(lab));
        } catch (error) {
            next(error);
        }
    },

    addSupporters: async (req, res, next) => {
        try {
            const model = req.body;
            const labId = req.body.labId;
            const result = await labService.addSupportersToLab(model);
            await redisClient.del(`lab:${labId}`);
            res.status(200).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    removeSupporters: async (req, res, next) => {
        try {
            const model = req.body;
            const labId = req.body.labId;
            const result = await labService.removeSupportersFromLab(model);
            await redisClient.del(`lab:${labId}`);
            res.status(200).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    updateLab: async (req, res, next) => {
        try {
            const model = req.body;
            const labId = req.params.id;
            const lab = await labService.updateLab(labId, model, req.user.id);
            await redisClient.del(`lab:${labId}`);
            res.status(HttpStatus.Success).json(formatResponse(lab));
        } catch (error) {
            next(error);
        }
    },

    deleteLab: async (req, res, next) => {
        try {
            const labId = req.params.id;
            await labService.deleteLab(req.params.id, req.user.id);
            await redisClient.del(`lab:${labId}`);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },

    download: async (req, res, next) => {
        const labId = req.params.id;
        const userId = req.user.id; // Lấy ID người dùng từ session hoặc token

        try {
            const doc = await labService.download(labId, userId);

            // Thiết lập headers cho PDF
            res.setHeader('Content-disposition', 'attachment; filename=lab.pdf');
            res.setHeader('Content-type', 'application/pdf');

            // Gửi PDF đến client
            doc.pipe(res);
            doc.end();
        } catch (error) {
            next(error);
        }
    },


}

module.exports = labController