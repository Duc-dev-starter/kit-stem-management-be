const { redisClient } = require('../config');
const { API_PATH, HttpStatus } = require('../consts')
const { userService } = require('../services');
const { formatResponse, createCacheKey } = require("../utils");

const userController = {
    generateUser: async (req, res, next) => {
        try {
            const model = new Regi
        } catch (error) {

        }
    },

    register: async (req, res, next) => {
        try {
            const model = req.body;
            const routerPath = req.originalUrl;
            const user = await userService.createUser(
                model,
                routerPath === API_PATH.USERS_GOOGLE,
                !(routerPath === API_PATH.CREATE_USERS),
            )
            res.status(HttpStatus.Created).json(formatResponse(user));
        } catch (error) {
            next(error);
        }
    },
    getUsers: async (req, res, next) => {
        try {
            const model = req.body;
            const result = await userService.getUsers(model);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },
    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const cachedUser = await redisClient.get(`user:${userId}`);

            if (cachedUser) {
                return res.status(HttpStatus.Success).json(formatResponse(JSON.parse(cachedUser)));
            }
            const user = await userService.getUserById(userId, true, req.user);
            await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user));
            res.status(HttpStatus.Success).json(formatResponse(user));
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            await userService.changePassword(req.body);
            await redisClient.del(`user:${req.body.user_id}`);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },
    changeStatus: async (req, res, next) => {
        try {
            await userService.changeStatus(req.body);
            await redisClient.del(`user:${req.body.user_id}`);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },
    changeRole: async (req, res, next) => {
        try {
            await userService.changeRole(req.body);
            await redisClient.del(`user:${req.body.user_id}`);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await userService.updateUser(userId, req.body);
            await redisClient.del(`user:${userId}`);
            res.status(HttpStatus.Success).json(formatResponse(user));
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const userId = req.params.id;
            await userService.deleteUser(userId);
            await redisClient.del(`user:${userId}`);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = userController;