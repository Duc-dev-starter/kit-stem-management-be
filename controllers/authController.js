const { HttpStatus } = require('../const');
const authService = require('../services/authService');
const { formatResponse } = require('../utils');

const authController = {
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.status(HttpStatus.OK).json(formatResponse(result));
        } catch (error) {
            next(error); // Đẩy lỗi qua error middleware
        }
    },

    // Các action khác như register, logout, v.v.
};

module.exports = authController;
