const { default: mongoose, startSession } = require("mongoose");
const { HttpStatus, PREFIX_TITLE, CartStatusEnum, CART_STATUS_CHANGE_PAIRS, PurchaseStatusEnum } = require("../consts");
const HttpException = require("../exception");
const { cartRepository, kitRepository, labRepository, comboRepository } = require("../repository");
const { isEmptyObject, generateRandomNo, itemsQuery, formatPaginationData, sendMail } = require("../utils");
const { Cart, Purchase, Transaction, Kit, Lab, Combo, User } = require("../models");

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
    },

    getCartById: async (id) => {
        const detail = await cartRepository.findOneCart(id);

        if (!detail) {
            throw new HttpException(HttpStatus.BadRequest, `Cart is not exists.`);
        }
        return detail;
    },

    updateStatusCart: async (model, user) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const { items, status } = model;

        if (status === CartStatusEnum.NEW) {
            throw new HttpException(HttpStatus.BadRequest, `Cannot update cart status to '${CartStatusEnum.NEW}'`);
        }

        const session = await startSession();
        session.startTransaction();

        try {
            let totalAmount = 0;
            const purchases = [];
            let productName = [];
            for (const item of items) {
                const cartExists = await Cart.findOne({ _id: item._id, is_deleted: false }).session(session);
                console.log(cartExists)
                if (String(cartExists.user_id) !== String(user.id)) {
                    throw new HttpException(HttpStatus.NotFound, `Cart with ID ${item._id} not found or not owned by user.`);
                }
                if (!cartExists) {
                    throw new HttpException(HttpStatus.BadRequest, `Cart '${item.cart_no}' does not exist.`);
                }

                if (cartExists.status === CartStatusEnum.COMPLETED) {
                    throw new HttpException(HttpStatus.BadRequest, `Cart '${item.cart_no}' is already completed!`);
                }

                const isValidChangeStatus = CART_STATUS_CHANGE_PAIRS.some(
                    (pair) => pair[0] === cartExists.status && pair[1] === model.status,
                );

                if (!isValidChangeStatus) {
                    throw new HttpException(
                        HttpStatus.BadRequest,
                        `Invalid status change. Current cart item '${item.cart_no}' cannot update status: ${cartExists.status} -> ${model.status}`,
                    );
                }

                // update cart status
                cartExists.status = status;
                cartExists.updated_at = new Date();
                const updateCart = await cartExists.save({ session });
                if (!updateCart) {
                    throw new HttpException(HttpStatus.BadRequest, `Cannot update status cart '${item.cart_no}'!`);
                }

                const discountRate = cartExists.discount / 100;  // Chuyển 0.5% thành 0.005
                const pricePaid = cartExists.price * (1 - discountRate);
                totalAmount += pricePaid;

                // Tạo bản ghi Purchase để người dùng theo dõi đơn hàng
                if (status === CartStatusEnum.COMPLETED) {
                    purchases.push({
                        purchase_no: generateRandomNo(PREFIX_TITLE.PURCHASE),
                        status: PurchaseStatusEnum.NEW,
                        price_paid: pricePaid,
                        price: cartExists.price,
                        discount: cartExists.discount,
                        cart_id: cartExists._id,
                        product_id: cartExists.product_id,
                        product_type: cartExists.product_type,
                        user_id: cartExists.user_id,
                    });
                    console.log(cartExists);
                    // Giảm quantity của sản phẩm trong kho
                    const productModel = cartExists.product_type === 'kit' ? Kit
                        : cartExists.product_type === 'lab' ? Lab
                            : Combo; // Giả sử bạn đã định nghĩa các model Lab, Combo
                    const product = await productModel.findOneAndUpdate(
                        { _id: cartExists.product_id, is_deleted: false, quantity: { $gt: 0 } },
                        { $inc: { quantity: -1 } },
                        { new: true, session }
                    );

                    if (!product || product.quantity < 0) {
                        throw new HttpException(HttpStatus.BadRequest, `Product ${cartExists.product_type} with ID ${cartExists.product_id} is out of stock!`);
                    }
                }
                // Xác định model dựa trên loại sản phẩm
                const productModel = cartExists.product_type === 'kit' ? Kit
                    : cartExists.product_type === 'lab' ? Lab
                        : Combo; // Giả sử các model này đã được định nghĩa

                // Lấy sản phẩm từ database
                const product = await productModel.findOne({ _id: cartExists.product_id, is_deleted: false });

                // Nếu tìm thấy sản phẩm, thêm tên vào mảng productName
                if (product) {
                    productName.push(product.name);
                } else {
                    throw new HttpException(HttpStatus.BadRequest, `Product with ID ${item.product_id} not found!`);
                }
            }
            // Tạo transaction ghi nhận việc tiền vào hệ thống
            if (status === CartStatusEnum.COMPLETED) {
                let transaction = await Transaction.findOne({}).session(session);
                if (!transaction) {
                    // Nếu không có transaction, tạo mới với balance ban đầu
                    transaction = new Transaction({
                        balance: 0,
                        balance_total: 0,
                        transactions: [],
                    });
                    await transaction.save({ session });
                }

                // Sử dụng balance từ transaction hiện có
                const balanceOld = transaction.balance;
                const balanceNew = balanceOld + totalAmount;

                // Cập nhật balance và thêm giao dịch mới
                await Transaction.findOneAndUpdate(
                    {},
                    {
                        $inc: { balance: totalAmount },
                        $push: {
                            transactions: {
                                type: 'purchase',
                                amount: totalAmount,
                                balance_old: balanceOld,
                                balance_new: balanceNew,
                                user_id: user._id,
                                created_at: new Date(),
                            },
                        },
                    },
                    { new: true, session }
                );

                if (!transaction) {
                    throw new HttpException(HttpStatus.BadRequest, `Update transaction failed!`);
                }
            }

            // Tạo tất cả bản ghi Purchase trong một lần để tăng hiệu năng
            if (status === CartStatusEnum.COMPLETED) {
                // (1) Cập nhật balance trong Transaction, giống như code trước

                // (2) Thêm vào Purchase
                await Purchase.insertMany(purchases, { session });

                const customer = await User.findOne({ _id: user.id, is_deleted: false });
                if (!customer) {
                    throw new HttpException(HttpStatus.BadRequest, 'User is not found!');
                }
                // (3) Gửi email
                const sendMailResult = await sendMail({
                    toMail: customer.email,
                    subject: `Buy product success`,
                    html: `Hello, ${customer.name}! <br> Your buy product success, please check info in list product was purchased: ${productName.toString()}`,
                });
                if (!sendMailResult) {
                    throw new HttpException(HttpStatus.BadRequest, `Cannot send mail for ${student.email}`);
                }
            }

            await session.commitTransaction();
            session.endSession();

            return { message: 'Cart status, transaction, and purchase records updated successfully' };
        } catch (error) {
            await session.abortTransaction();

            throw new HttpException(HttpStatus.InternalServerError, `Failed to update cart status: ${error.message}`);
        }
        finally {
            session.endSession();
        }

    },

    deleteCart: async (id) => {
        const detail = await cartService.getCartById(id);
        if (!detail || detail.is_deleted) {
            throw new HttpException(HttpStatus.BadRequest, `Cart is not exists.`);
        }

        if (detail.status !== CartStatusEnum.NEW && detail.status !== CartStatusEnum.CANCEL) {
            throw new HttpException(
                HttpStatus.BadRequest,
                `You only delete cart with status '${CartStatusEnum.NEW}' or '${CartStatusEnum.CANCEL}`,
            );
        }

        const updatedItem = await cartRepository.deleteCart(id);

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete cart failed!');
        }

        return true;
    }
}

module.exports = cartService