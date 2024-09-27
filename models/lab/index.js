const Lab = require('./Lab');
const validateCreateLab = require('./CreateLabSchema');
const validateAddSupporters = require('./AddSupporterSchema');
const validateUpdateLab = require('./UpdateLabSchema');
const validateSearchLab = require('./SearchLabSchema');

module.exports = {
    Lab,
    validateCreateLab,
    validateAddSupporters,
    validateUpdateLab,
    validateSearchLab
}