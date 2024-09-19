const logger = require('./logger');
const sendMail = require('./sendMail');
const hashPassword = require('./hashPassword');
const { createToken, createTokenVerifiedUser } = require('./token');
const { formatResponse, getUserIdCurrent, isEmptyObject } = require('./helpers');
const { checkUserMatch, checkValidUrl, } = require('./validation');

module.exports = {
    logger,
    sendMail,
    hashPassword,
    createToken,
    checkUserMatch,
    checkValidUrl,
    formatResponse,
    getUserIdCurrent,
    isEmptyObject,
    createTokenVerifiedUser
}