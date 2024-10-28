const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { isEmptyObject } = require("../utils");
const { kitRepository, labRepository, comboRepository, reviewRepository } = require("../repository");

const reviewService = {
    create: async (model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        model.user_id = userId;
        console.log(userId)
        // Kiểm tra tính hợp lệ của product (kit, lab, combo)
        const isValidProduct = await reviewService.checkProductValid(model);
        if (!isValidProduct) {
            throw new HttpException(HttpStatus.BadRequest, 'Product is not valid');
        }
        console.log(isValidProduct);
        // Xử lý tạo review tại đây (ví dụ lưu vào database)
        // const review = await Review.create(model);
        // return review;
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
};

module.exports = reviewService;
