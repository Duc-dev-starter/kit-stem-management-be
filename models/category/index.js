const Category = require('./Category');
const validateSearchCategory = require('./SearchCategorySchema');
const validateUpdateCategory = require('./UpdateCategorySchema');
const validateCreateCategory = require('./CreateCategorySchema');

module.exports = {
    Category,
    validateSearchCategory,
    validateUpdateCategory,
    validateCreateCategory
}