//User Schema
const { User, validateChangePassword, validateChangeRole, validateRegisterUser, validateSearchUser, validateStatusUser, validateUpdateUser } = require('./user');

//Blog Schema
const { Blog, validateCreateBlog, validateSearchBlog, validateUpdateBlog } = require('./blog');

//Category Schema
const { Category, validateSearchCategory, validateUpdateCategory, validateCreateCategory } = require('./category');

module.exports = {
    User,
    validateChangePassword,
    validateChangeRole,
    validateRegisterUser,
    validateSearchUser,
    validateStatusUser,
    validateUpdateUser,
    Blog,
    validateCreateBlog,
    validateSearchBlog,
    validateUpdateBlog,
    Category,
    validateSearchCategory,
    validateUpdateCategory,
    validateCreateCategory
}