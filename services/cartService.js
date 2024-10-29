const { default: mongoose } = require("mongoose");
const { HttpStatus, PREFIX_TITLE } = require("../consts");
const HttpException = require("../exception");
const { cartRepository, kitRepository, labRepository, comboRepository } = require("../repository");
const { isEmptyObject, generateRandomNo, itemsQuery, formatPaginationData } = require("../utils");

const cartService = {
    create: async (model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        // check product exist in cart with user_id
        const cart = await cartRepository.findCartById(model.product_id, userId)
        if (cart) {
            throw new HttpException(HttpStatus.BadRequest, `Product is already in cart with status '${cart.status}' !`);
        }

        const productDetails = await cartService.getProductDetails(model.product_id, model.product_type);


        model.cart_no = generateRandomNo(PREFIX_TITLE.CART);
        model.price = productDetails.price;
        model.discount = productDetails.discount;
        model.user_id = userId;

        const createdItem = await cartRepository.createCart(model);
        if (!createdItem) {
            throw new HttpException(HttpStatus.Accepted, `Create item failed!`);
        }
        return createdItem;
    },

    getProductDetails: async (productId, productType) => {
        let product;

        switch (productType) {
            case 'kit':
                product = await kitRepository.findKitById(productId); // Giả sử bạn có `kitRepository`
                break;
            case 'lab':
                product = await labRepository.findLabById(productId); // Giả sử bạn có `labRepository`
                break;
            case 'combo':
                product = await comboRepository.findComboById(productId); // Giả sử bạn có `comboRepository`
                break;
            default:
                throw new Error(`Invalid product type: ${productType}`);
        }

        if (!product) {
            throw new Error(`Product not found for type ${productType} with ID ${productId}`);
        }
        return product;
    },


    getCarts: async (model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const { searchCondition, pageInfo } = model;
        const { pageNum, pageSize } = pageInfo;
        if (!userId) {
            throw new HttpException(HttpStatus.BadRequest, 'User ID is required');
        }


        const { carts, totalCount } = await cartRepository.findCartsWithPagination(userId, searchCondition, pageNum, pageSize);

        // Trả về dữ liệu với định dạng phân trang
        return formatPaginationData(carts, pageNum, pageSize, totalCount);
    }
}

module.exports = cartService