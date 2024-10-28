const reviewController = {
    create: async (req, res, next) => {
        try {
            const model = req.body;
            const newItem = await this.reviewService.create(model, req.user.id);
            res.status(HttpStatus.Created).json(formatResponse(newItem));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = reviewController