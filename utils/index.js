const logger = require('./logger');
const sendMail = require('./sendMail');
const { encodePasswordUserNormal, generateRandomPassword } = require('./hashPassword');
const { createToken, createTokenVerifiedUser } = require('./token');
const { getUserIdCurrent, isEmptyObject } = require('./helpers');
const { checkUserMatch, checkValidUrl, } = require('./validation');
const { formatPaginationData, formatResponse } = require('./formatResponse.js');
const itemsQuery = require('./query.js');

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
    generateRandomPassword,
    formatPaginationData,
    itemsQuery
}