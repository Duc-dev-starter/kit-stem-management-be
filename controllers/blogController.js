const { HttpStatus } = require("../consts");
const { blogService } = require("../services");
const { formatResponse } = require("../utils");

const blogController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const blog = await blogService.create(model, req.user);
            res.status(HttpStatus.Success).json(formatResponse(blog));
        } catch (error) {
            next(error);
        }
    },

    getBlogs: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await blogService.getBlogs(model);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    getBlog: async (req, res, next) => {
        try {
            const blog = await blogService.getBlog(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(blog));
        } catch (error) {
            next(error);
        }
    },

    updateBlog: async (req, res, next) => {
        try {
            const model = req.body;
            const blog = await blogService.updateBlog(req.params.id, model);
            res.status(HttpStatus.Success).json(formatResponse(blog));
        } catch (error) {
            next(error);
        }
    },

    deleteBlog: async (req, res, next) => {
        try {
            await blogService.deleteBlog(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = blogController;