const { HttpStatus } = require("../consts");
const HttpException = require("../exception");

const validationMiddleware = (validateFn) => {
    return async (req, res, next) => {
        try {
            await validateFn(req.body);

            next();
        } catch (validationError) {
            const validationErrors = [];

            // Xử lý lỗi và trả về thông tin chi tiết
            for (const key in validationError.errors) {
                validationErrors.push({
                    message: validationError.errors[key].message,
                    field: key,
                });
            }

            return next(new HttpException(HttpStatus.BadRequest, "Validation Error", validationErrors));
        }
    };
};

module.exports = validationMiddleware;
