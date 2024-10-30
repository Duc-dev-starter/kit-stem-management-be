const { HttpStatus, UserRoleEnum } = require("../consts");
const HttpException = require("../exception");
const { isEmptyObject, checkUserMatch } = require("../utils");
const { kitRepository, labRepository, comboRepository, reviewRepository } = require("../repository");
const { Purchase } = require("../models");

const reviewService = {
    create: async (model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        model.user_id = userId;
        if (model.comment) {
            const trimmedComment = model.comment.trim().replace(/\s+/g, ' ');
            if (trimmedComment === '' || /\s{2,}/.test(model.comment)) {
                throw new HttpException(HttpStatus.BadRequest, 'Comment cannot contain only spaces or have excessive whitespace');
            }
        } else {
            throw new HttpException(HttpStatus.BadRequest, 'Comment is required');
        }
        // Kiểm tra tính hợp lệ của product (kit, lab, combo)
        const isValidProduct = await reviewService.checkProductValid(model);
        if (!isValidProduct) {
            throw new HttpException(HttpStatus.BadRequest, 'Product is not valid');
        }

        // check only user purchase product must can review
        const isPurchased = await Purchase
            .findOne({
                product_id: model.product_id,
                user_id: userId,
                product_type: model.product_type,
            })
            .limit(1)
            .exec();
        if (!isPurchased) {
            throw new HttpException(HttpStatus.BadRequest, 'You must purchase this product before review!');
        }

        const hasReviewed = await reviewService.hasUserReviewedPurchase(isPurchased._id, userId);
        if (hasReviewed) {
            throw new HttpException(HttpStatus.Conflict, 'User has already reviewed this purchase');
        }

        model.purchase_id = isPurchased._id;

        const newReview = await reviewRepository.createReview(model);
        if (!newReview) {
            throw new HttpException(HttpStatus.Accepted, 'Failed to create review');
        }
        return newReview;
    },

    checkProductValid: async (model) => {
        const { product_id, product_type } = model;

        // Kiểm tra theo loại sản phẩm
        let product;
        if (product_type === 'kit') {
            product = await kitRepository.findKitById(product_id);
        } else if (product_type === 'lab') {
            product = await labRepository.findLabById(product_id);
        } else if (product_type === 'combo') {
            product = await comboRepository.findComboById(product_id);
        }

        return product !== null; // Trả về `true` nếu tìm thấy sản phẩm hợp lệ
    },

    hasUserReviewedPurchase: async (purchaseId, userId) => {
        // Kiểm tra trong repository xem user đã review cho `purchase_id` cụ thể chưa
        const count = await reviewRepository.countReviewsByUserAndPurchase(userId, purchaseId);
        return count > 0; // Trả về `true` nếu đã có review cho `purchase_id` này
    },


    getReviewById: async (id) => {
        const review = await reviewRepository.findReviewById(id);
        if (!review) {
            throw new HttpException(HttpStatus.BadRequest, `Review is not exists.`);
        }
        return review;
    },

    updateReview: async (id, model, user) => {
        const userId = user.id;
        const userRole = user.role;
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        model.user_id = userId;
        let errorResults = [];

        console.log('test')
        // check item exits
        const item = await reviewService.getReviewById(id);
        if (item && item.user_id) {
            if (userRole === UserRoleEnum.CUSTOMER) {
                // check valid user
                checkUserMatch(userId, item.user_id.toString(), 'review');
            }
        }

        await reviewService.checkProductValid(model);

        // check valid
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BadRequest, '', errorResults);
        }

        const updateData = {
            rating: model.rating,
            comment: model.comment,
            updated_at: new Date(),
        };

        const updatedItem = await reviewRepository.updateReview(id, updateData)

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update item info failed!');
        }

        const result = await reviewService.getReviewById(id);
        return result;

    },

    deleteReview: async (id, user) => {
        const review = await reviewService.getReviewById(id);
        const userId = user.id;
        const userRole = user.role;
        if (!review || review.is_deleted) {
            throw new HttpException(HttpStatus.BadRequest, `Review is not exists.`);
        }

        if (review && review.user_id) {
            if (userRole === UserRoleEnum.CUSTOMER) {
                // check valid user
                checkUserMatch(userId, review.user_id.toString(), 'review');
            }
        }

        const updatedReview = await reviewRepository.deleteReview(id)

        if (!updatedReview.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete item failed!');
        }

        return true;
    }

};

module.exports = reviewService;
