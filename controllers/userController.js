const { API_PATH, HttpStatus } = require('../consts')
const User = require("../models/User")
const { userService } = require('../services');
const { getUserById } = require('../services/userService');
const { formatResponse } = require("../utils");

const userController = {
    generateUser: async (req, res, next) => {
        try {
            const model = new User('')
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
    getUserById: async (req, res, next) => {
        try {
            const user = await userService.getUserById(req.params.id, true, req.user);
            res.status(HttpStatus.Success).json(formatResponse(user));
        } catch (error) {
            next(error)
        }
    }

}

module.exports = userController;