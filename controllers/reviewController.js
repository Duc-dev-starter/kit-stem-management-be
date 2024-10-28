const { HttpStatus } = require("../consts");
const { reviewService } = require("../services");
const { formatResponse } = require("../utils");

const reviewController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const newItem = await reviewService.create(model, req.user.id);
            res.status(HttpStatus.Created).json(formatResponse(newItem));
        } catch (error) {
            next(error);
        }
    },

    getReviewById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const review = await reviewService.getReviewById(id);
            res.status(HttpStatus.Success).json(formatResponse(review));
        } catch (error) {
            next(error);
        }
    },

    updateReview: async (req, res, next) => {
        try {
            const model = req.body;
            console.log(model);
            const item = await reviewService.updateReview(req.params.id, model, req.user);
            res.status(HttpStatus.Success).json(formatResponse(item));
        } catch (error) {
            next(error);
        }
    },

    deleteReview: async (req, res, next) => {
        try {
            await reviewService.deleteReview(req.params.id, req.user);
            res.status(HttpStatus.Success).json(formatResponse(null));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = reviewController