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
            // Stage 2: Lookup từ collection kits
            {
                $lookup: {
                    from: 'kits',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product_info_kit'
                }
            },
            // Stage 3: Lookup từ collection labs
            {
                $lookup: {
                    from: 'labs',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product_info_lab'
                }
            },
            // Stage 4: Lookup từ collection combos
            {
                $lookup: {
                    from: 'combos',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product_info_combo'
                }
            },
            // Stage 5: Unwind để chỉ lấy phần tử đầu tiên từ mỗi lookup
            {
                $unwind: { path: '$product_info_kit', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$product_info_lab', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$product_info_combo', preserveNullAndEmptyArrays: true }
            },
            // Stage 6: Sort (nếu cần)
            {
                $sort: { created_at: -1 }
            },
            // Stage 7: Pagination
            {
                $skip: (pageNum - 1) * pageSize
            },
            {
                $limit: pageSize
            },
            // Stage 8: Project để chọn product_name và product_image dựa trên product_type, và tính toán price_paid
            {
                $project: {
                    cart_no: 1,
                    status: 1,
                    price: 1,
                    discount: 1,
                    product_id: 1,
                    product_type: 1,
                    user_id: 1,
                    is_deleted: 1,
                    created_at: 1,
                    updated_at: 1,
                    product_name: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$product_type', 'kit'] }, then: '$product_info_kit.name' },
                                { case: { $eq: ['$product_type', 'lab'] }, then: '$product_info_lab.name' },
                                { case: { $eq: ['$product_type', 'combo'] }, then: '$product_info_combo.name' }
                            ],
                            default: 'Unknown Product'
                        }
                    },
                    product_image: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$product_type', 'kit'] }, then: '$product_info_kit.image_url' },
                                { case: { $eq: ['$product_type', 'lab'] }, then: '$product_info_lab.image_url' },
                                { case: { $eq: ['$product_type', 'combo'] }, then: '$product_info_combo.image_url' }
                            ],
                            default: 'No Image Available'
                        }
                    },
                    // Field mới: price_paid (giá sau khi áp dụng discount)
                    price_paid: {
                        $subtract: [
                            "$price",
                            { $multiply: ["$price", { $divide: ["$discount", 100] }] }
                        ]
                    }
                }
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