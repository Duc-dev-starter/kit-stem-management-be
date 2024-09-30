const { redisClient } = require("../config");
const { HttpStatus } = require("../consts");
const { labService } = require("../services");
const { formatResponse, createCacheKey } = require("../utils");

const labController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const newLab = await labService.create(model, req.user.id);
            await redisClient.del("labs_cache");
            res.status(HttpStatus.Success).json(formatResponse(newLab));
        } catch (error) {
            next(error);
        }
    },

    getLabs: async (req, res, next) => {
        try {
            const model = req.body;
            const cacheKey = `labs_cache_${createCacheKey(model)}`;
            const cacheLabs = await redisClient.get(cacheKey);
            if (cacheLabs) {
                return res.status(HttpStatus.Success).json(formatResponse(JSON.parse(cacheLabs)));
            }
            const result = await labService.getLabs(model, req.user);
            await redisClient.set(cacheKey, JSON.stringify(result), 'Ex', 3600);
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
            await redisClient.del("labs_cache");
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
            await redisClient.del("labs_cache");
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
            await redisClient.del("labs_cache");
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
            await redisClient.del("labs_cache");
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = labController