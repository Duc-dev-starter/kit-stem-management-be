const { Review } = require("../models");

const reviewRepository = {
    createReview: async (data) => {
        try {
            return await Review.create(data);
        } catch (error) {
            console.log(error);
            return;
        }
    }
}

module.exports = reviewRepository; 