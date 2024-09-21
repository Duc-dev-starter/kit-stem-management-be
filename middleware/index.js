const authMiddleWare = require("./auth");
const errorMiddleware = require('./error');
const validationMiddleware = require("./validation");

module.exports = {
    authMiddleWare,
    errorMiddleware,
    validationMiddleware
}

