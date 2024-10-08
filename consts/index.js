const HttpStatus = require('./httpStatus');
const API_PATH = require('./path');
const { UserRole, UserRoleEnum, UserArr } = require('./userRole')
const COLLECTION_NAME = require('./collectionName');
const { KitStatus, KitStatusEnum, VALID_STATUS_CHANGE_PAIRS, REQUIRED_COMMENT_STATUSES } = require('./kitStatus');
const { LabStatus, LabStatusEnum, REQUIRED_COMMENT_LAB_STATUSES, VALID_STATUS_LAB_CHANGE_PAIRS } = require('./labStatus');
module.exports = {
    HttpStatus,
    API_PATH,
    UserRole,
    UserRoleEnum,
    COLLECTION_NAME,
    KitStatusEnum,
    KitStatus,
    VALID_STATUS_CHANGE_PAIRS,
    REQUIRED_COMMENT_STATUSES,
    LabStatus,
    LabStatusEnum,
    REQUIRED_COMMENT_LAB_STATUSES,
    VALID_STATUS_LAB_CHANGE_PAIRS,
    UserArr
}