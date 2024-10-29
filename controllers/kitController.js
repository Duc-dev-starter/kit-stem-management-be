const { redisClient } = require("../config");
const { HttpStatus } = require("../consts");
const { kitService } = require("../services");
const { formatResponse, createCacheKey } = require("../utils");

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
            const result = await kitService.getKits(model);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    getKit: async (req, res, next) => {
        try {
            const kitId = req.params.id;
            // const cacheKit = await redisClient.get(`kit:${kitId}`);
            // if (cacheKit) {
            //     return res.status(HttpStatus.Success).json(JSON.parse(cacheKit));
            // }
            const kit = await kitService.getKit(kitId);
            // await redisClient.setEx(`kit:${kitId}`, 360, JSON.stringify(kit));
            res.status(HttpStatus.Success).json(formatResponse(kit));
        } catch (error) {
            next(error);
        }
    },

    changeStatusKit: async (req, res, next) => {
        try {
            const model = req.body;
            const kitId = req.body.kit_id;
            const item = await kitService.changeStatusKit(model, req.user);
            // await redisClient.del(`kit:${kitId}`);
            res.status(HttpStatus.Success).json(formatResponse(item));
        } catch (error) {
            next(error);
        }
    },

    updateKit: async (req, res, next) => {
        try {
            const model = req.body;
            const kitId = req.params.id;
            const kit = await kitService.updateKit(kitId, model, req.user.id);
            // await redisClient.del(`kit:${kitId}`);
            res.status(HttpStatus.Success).json(formatResponse(kit));
        } catch (error) {
            next(error)
        }
    },

    deleteKit: async (req, res, next) => {
        try {
            const kitId = req.params.id;
            await kitService.deleteKit(kitId, req.user.id);
            // await redisClient.del(`kit:${kitId}`);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = kitController;