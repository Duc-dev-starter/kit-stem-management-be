const jwt = require('jsonwebtoken');
const getUserIdCurrent = (authHeader) => {
    if (!authHeader) {
        return '';
    }
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? '');
    return user;
};

const formatResponse = (data, success = true) => {
    return {
        success,
        data,
    };
};

const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0;

module.exports = {
    formatResponse,
    getUserIdCurrent,
    isEmptyObject
}