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

    findReviewById: async (id) => {
        return await Review.findOne({ _id: id, is_deleted: false }).lean();
    },

    deleteReview: async (id) => {
        return await Review.updateOne(
            { _id: id },
            { is_deleted: true, updated_at: new Date() },
        );
    },

    updateReview: async (id, updateData) => {
        return await Review.updateOne({ _id: id }, updateData);
    },

}

module.exports = reviewRepository; 