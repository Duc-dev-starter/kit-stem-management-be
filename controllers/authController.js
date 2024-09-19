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
            next(error); // Đẩy lỗi qua error middleware
        }
    },

};

module.exports = authController;
