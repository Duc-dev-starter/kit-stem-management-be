const logger = require('./logger');
const sendMail = require('./sendMail');
const { encodePasswordUserNormal, generateRandomPassword } = require('./hashPassword');
const { createToken, createTokenVerifiedUser } = require('./token');
const { formatResponse, getUserIdCurrent, isEmptyObject } = require('./helpers');
const { checkUserMatch, checkValidUrl, } = require('./validation');

module.exports = {
    logger,
    sendMail,
    createToken,
    checkUserMatch,
    checkValidUrl,
    formatResponse,
    getUserIdCurrent,
    isEmptyObject,
    createTokenVerifiedUser,
    encodePasswordUserNormal,
    generateRandomPassword
}