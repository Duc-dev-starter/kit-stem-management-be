const { HttpStatus, API_PATH } = require('../consts');
const { authService } = require('../services');
const { formatResponse } = require('../utils');

const authController = {
    login: async (req, res, next) => {
        try {
            const model = req.body;
            const isGoogle = req.route.path === API_PATH.AUTH_GOOGLE ? true : false;
            const accessToken = await authService.login(model, isGoogle);
            res.status(HttpStatus.Success).json(formatResponse(accessToken));
        } catch (error) {
            next(error);
        }
    },

    getCurrentLoginUser: async (req, res, next) => {
        try {
            const user = await authService.getCurrentLoginUser(req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(user));
        } catch (error) {
            next(error);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            await authService.forgotPassword(req.body.email);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            await authService.logout(req.user.id);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }

};

module.exports = authController;
