const jwt = require('jsonwebtoken');
const getUserIdCurrent = (authHeader) => {
    if (!authHeader) {
        return '';
    }
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? '');
    return user;
};


const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0;

module.exports = {
    getUserIdCurrent,
    isEmptyObject
}