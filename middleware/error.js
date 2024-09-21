
const { HttpStatus } = require("../consts");
const { logger } = require("../utils");

const errorMiddleware = (error, req, res, next) => {
    const status = error.status || HttpStatus.InternalServerError;
    const messageErrors = error.errors?.length ? null : "Something went wrong!";
    const message = error.message ? error.message : messageErrors;

    logger.error(`[ERROR] - Status: ${status} - Msg: ${message}`);
    res.status(status).json({
        success: false,
        message,
        errors: error.errors,
    });
};

module.exports = errorMiddleware;
