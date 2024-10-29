const { default: mongoose } = require("mongoose");
const { Cart } = require("../models")

const cartRepository = {
    findCartById: async (model, userId) => {
        return await Cart.findOne({
            product_id: model.product_id,
            user_id: userId,
            is_deleted: false,
        })
    },

    createCart: async (model) => {
        return await Cart.create(model)
    },

    findCartsWithPagination: async (userId, searchCondition, pageNum = 1, pageSize = 10) => {
        const { product_id, status, is_deleted } = searchCondition || {};

        const query = [
            // Stage 1: Match user_id và các điều kiện khác
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                    is_deleted: is_deleted ?? false,
                    ...(product_id && { product_id: new mongoose.Types.ObjectId(product_id) }),
                    ...(status && { status })
                }
            },
            // Stage 2: Sort (sắp xếp nếu cần)
            {
                $sort: { created_at: -1 }
            },
            // Stage 3: Pagination
            {
                $skip: (pageNum - 1) * pageSize
            },
            {
                $limit: pageSize
            }
        ];

        // Thực thi aggregate và đếm số lượng
        const [carts, totalCount] = await Promise.all([
            Cart.aggregate(query), // lấy dữ liệu có phân trang
            Cart.countDocuments({
                user_id: new mongoose.Types.ObjectId(userId),
                is_deleted: is_deleted ?? false,
                ...(product_id && { product_id: new mongoose.Types.ObjectId(product_id) }),
                ...(status && { status })
            }) // lấy tổng số lượng không phân trang
        ]);

        return { carts, totalCount };
    },

    deleteCart: async (id) => {
        return await Cart.updateOne({ _id: id }, { is_deleted: true, updated_at: new Date() });
    },

    findOneCart: async (id) => {
        return await Cart.findOne({ _id: id, is_deleted: false }).lean();
    }
}

module.exports = cartRepository