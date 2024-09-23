const { HttpStatus } = require("../consts");
const { categoryService } = require("../services");
const { formatResponse } = require("../utils");

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
            const model = req.body;
            const category = await categoryService.getCategory(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(category));
        } catch (error) {
            next(error);
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const model = req.body;
            const category = await categoryService.updateCategory(req.params.id, model);
            res.status(HttpStatus.Success).json(formatResponse(category));
        } catch (error) {
            next(error);
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            await categoryService.deleteCategory(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = categoryController;