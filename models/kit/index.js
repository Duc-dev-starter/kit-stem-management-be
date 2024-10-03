const Kit = require('./Kit');
const validateSearchKit = require('./SearchKitSchema');
const validateUpdateKit = require('./UpdateKitSchema');
const validateCreateKit = require('./CreateKitSchema');
const validateChangeStatusKit = require('./ChangeStatusKitSchema');

module.exports = {
    Kit,
    validateChangeStatusKit,
    validateCreateKit,
    validateSearchKit,
    validateUpdateKit
}