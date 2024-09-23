const Blog = require('./Blog');
const validateCreateBlog = require('./CreateBlogSchema');
const validateSearchBlog = require('./SearchBlogSchema');
const validateUpdateBlog = require('./UpdateBlogSchema');

module.exports = {
    Blog,
    validateCreateBlog,
    validateSearchBlog,
    validateUpdateBlog
}