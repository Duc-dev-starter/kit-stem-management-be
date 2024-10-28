const Review = require('./Review');
const validateCreateReview = require('./CreateReviewSchema')
const validateUpdateReview = require('./UpdateReviewSchema')

module.exports = {
    Review,
    validateCreateReview,
    validateUpdateReview
}