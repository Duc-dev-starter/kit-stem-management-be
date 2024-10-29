const { default: mongoose } = require("mongoose");
const { UserRoleEnum } = require("../consts");
const { itemsQuery, formatPaginationData } = require("../utils");
const { Purchase } = require("../models");

const purchaseService = {
    getPurchases: async (model, user) => {
        const userId = user.id;
        const { searchCondition, pageInfo } = model;
        const { purchase_no, cart_no, product_id, product_type, status, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        let query = {};

        if (purchase_no) {
            const keywordValue = purchase_no.toLowerCase().trim();
            query = {
                ...query,
                purchase_no: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (cart_no) {
            const keywordValue = cart_no.toLowerCase().trim();
            query = {
                ...query,
                cart_no: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (user.role !== UserRoleEnum.ADMIN) {
            const userIdObj = new mongoose.Types.ObjectId(userId);
            query = {
                ...query,
                user_id: userIdObj,
            };
        }

        query = itemsQuery(query, { status, is_deleted });

        const purchases = await Purchase.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_info'
                }
            },
            {
                $unwind: {
                    path: '$user_info',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'kits',
                    localField: 'product_id', // so sánh với product_id trong purchases
                    foreignField: '_id', // so sánh với _id trong kits
                    as: 'product_info_kit'
                }
            },
            {
                $lookup: {
                    from: 'labs',
                    localField: 'product_id', // so sánh với product_id trong purchases
                    foreignField: '_id', // so sánh với _id trong labs
                    as: 'product_info_lab'
                }
            },
            {
                $lookup: {
                    from: 'combos',
                    localField: 'product_id', // so sánh với product_id trong purchases
                    foreignField: '_id', // so sánh với _id trong combos
                    as: 'product_info_combo'
                }
            },
            // Thêm unwind cho các product_info
            {
                $unwind: {
                    path: '$product_info_kit',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$product_info_lab',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$product_info_combo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    purchase_no: 1,
                    status: 1,
                    price_paid: 1,
                    price: 1,
                    discount: 1,
                    cart_id: 1,
                    product_id: 1,
                    product_type: 1,
                    user_id: 1,
                    created_at: 1,
                    updated_at: 1,
                    user_name: '$user_info.name',
                    product_name: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ['$product_type', 'kit'] },
                                    then: { $ifNull: ['$product_info_kit.name', 'Unknown Kit'] }
                                },
                                {
                                    case: { $eq: ['$product_type', 'lab'] },
                                    then: { $ifNull: ['$product_info_lab.name', 'Unknown Lab'] }
                                },
                                {
                                    case: { $eq: ['$product_type', 'combo'] },
                                    then: { $ifNull: ['$product_info_combo.name', 'Unknown Combo'] }
                                }
                            ],
                            default: 'Unknown Product'
                        }
                    }
                }
            },
            { $skip: (pageNum - 1) * pageSize },
            { $limit: pageSize }
        ]);

        console.log(purchases);

        const rowCount = await Purchase.find(query).countDocuments().exec();

        return formatPaginationData(purchases, pageNum, pageSize, rowCount);
    },




}

module.exports = purchaseService;