const { Review } = require("../models");

const reviewRepository = {
    createReview: async (data) => {
        try {
            return await Review.create(data);
        } catch (error) {
            console.log(error);
            return;
        }
    },

    countReviewsByUserAndProduct: async (userId, productId, productType) => {
        return await Review.countDocuments({
            user_id: userId,
            product_id: productId,
            product_type: productType,
        });
    },

}

module.exports = reviewRepository; 