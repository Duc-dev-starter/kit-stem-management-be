const { HttpStatus } = require("../consts");
const HttpException = require("../exception");

const validationMiddleware = (Model) => {
    return async (req, res, next) => {
        try {
            // Tạo một instance từ model với dữ liệu từ body
            const instance = new Model(req.body);

            // Chạy validate bằng mongoose
            await instance.validate();

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
