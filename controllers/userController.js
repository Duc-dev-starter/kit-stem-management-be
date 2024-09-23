const { API_PATH, HttpStatus } = require('../consts')
const { userService } = require('../services');
const { formatResponse } = require("../utils");

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
            const routerPath = req.route.path;
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
            const model = req.body
            const result = await userService.getUsers(model);
            res.status(HttpStatus.Success).json(formatResponse(result));
        } catch (error) {
            next(error);
        }
    },
    getUserById: async (req, res, next) => {
        try {
            const user = await userService.getUserById(req.params.id, true, req.user);
            res.status(HttpStatus.Success).json(formatResponse(user));
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            await userService.changePassword(req.body);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },
    changeStatus: async (req, res, next) => {
        try {
            await userService.changeStatus(req.body);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },
    changeRole: async (req, res, next) => {
        try {
            await userService.changeRole(req.body);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.status(HttpStatus.Success).json(formatResponse(user));
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            await userService.deleteUser(req.params.id);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = userController;