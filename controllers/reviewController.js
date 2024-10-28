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
    }
}

module.exports = reviewController