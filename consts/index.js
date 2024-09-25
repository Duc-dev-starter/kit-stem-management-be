const HttpStatus = require('./httpStatus');
const API_PATH = require('./path');
const { UserRole, UserRoleEnum } = require('./userRole')
const COLLECTION_NAME = require('./collectionName');
const { KitStatus, KitStatusEnum, VALID_STATUS_CHANGE_PAIRS, REQUIRED_COMMENT_STATUSES } = require('./kitStatus');
module.exports = {
    HttpStatus,
    API_PATH,
    UserRole,
    UserRoleEnum,
    COLLECTION_NAME,
    KitStatusEnum,
    KitStatus,
    VALID_STATUS_CHANGE_PAIRS,
    REQUIRED_COMMENT_STATUSES
}