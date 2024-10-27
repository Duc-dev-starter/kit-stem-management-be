const { redisClient } = require("../config");
const { HttpStatus } = require("../consts");
const { categoryService } = require("../services");
const { formatResponse, createCacheKey } = require("../utils");

const categoryController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const category = await categoryService.create(model, req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(category));
        } catch (error) {
            next(error);
        }
    },
    getCategories: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await categoryService.getCategories(model);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },
    getCategory: async (req, res, next) => {
        try {
            const categoryId = req.params.id;
            // const cachedCategory = await redisClient.get(`category:${categoryId}`);

            // if (cachedCategory) {
            //     return res.status(HttpStatus.Success).json(formatResponse(JSON.parse(cachedCategory)));
            // }
            const category = await categoryService.getCategory(req.params.id);
            // await redisClient.setEx(`category:${categoryId}`, 3600, JSON.stringify(category));
            res.status(HttpStatus.Success).json(formatResponse(category));
        } catch (error) {
            next(error);
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const model = req.body;
            const categoryId = req.params.id
            const category = await categoryService.updateCategory(categoryId, model);
            // await redisClient.del(`category:${categoryId}`);
            res.status(HttpStatus.Success).json(formatResponse(category));
        } catch (error) {
            next(error);
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            const categoryId = req.params.id;
            await categoryService.deleteCategory(categoryId);
            // redisClient.del(`category:${categoryId}`);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = categoryController;