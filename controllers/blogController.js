const { redisClient } = require("../config");
const { HttpStatus } = require("../consts");
const { blogService } = require("../services");
const { formatResponse, createCacheKey } = require("../utils");

const blogController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const blog = await blogService.create(model, req.user);
            await redisClient.del("blogs_cache");
            res.status(HttpStatus.Success).json(formatResponse(blog));
        } catch (error) {
            next(error);
        }
    },

    getBlogs: async (req, res, next) => {
        try {
            const model = req.body;
            const cacheKey = `blogs_cache_${createCacheKey(model)}`;
            const cachedBlogs = await redisClient.get(cacheKey);
            if (cachedBlogs) {
                return res.status(HttpStatus.Success).json(formatResponse(JSON.parse(cachedBlogs)));
            }
            const result = await blogService.getBlogs(model);
            await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },

    getBlog: async (req, res, next) => {
        try {
            const blogId = req.params.id;

            const cachedBlog = await redisClient.get(`blog:${blogId}`);

            if (cachedBlog) {
                return res.status(HttpStatus.Success).json(formatResponse(JSON.parse(cachedBlog)));
            }

            const blog = await blogService.getBlog(blogId);

            await redisClient.setEx(`blog:${blogId}`, 3600, JSON.stringify(blog));

            res.status(HttpStatus.Success).json(formatResponse(blog));
        } catch (error) {
            next(error);
        }
    },

    updateBlog: async (req, res, next) => {
        try {
            const model = req.body;
            const blog = await blogService.updateBlog(req.params.id, model);
            await redisClient.del(`blog:${req.params.id}`);
            await redisClient.del("blogs_cache");
            res.status(HttpStatus.Success).json(formatResponse(blog));
        } catch (error) {
            next(error);
        }
    },

    deleteBlog: async (req, res, next) => {
        try {
            await blogService.deleteBlog(req.params.id);
            await redisClient.del(`blog:${req.params.id}`);
            await redisClient.del("blogs_cache");
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = blogController;