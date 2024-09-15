const logger = require('./logger');
const sendMail = require('./sendMail');
const hashPassword = require('./hashPassword');
const token = require('./token');
const { formatResponse, getUserIdCurrent } = require('./helpers');
const { checkUserMatch, checkValidUrl } = require('./validation');

module.exports = {
    logger,
    sendMail,
    hashPassword,
    token,
    checkUserMatch,
    checkValidUrl,
    formatResponse,
    getUserIdCurrent
}