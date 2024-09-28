const { KitStatusEnum, HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { Kit } = require("../models");
const { isEmptyObject, itemsQuery } = require("../utils");
const mongoose = require('mongoose');

const clientService = {
    getKits: async (model, user) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const userId = user.id;
        const userRole = user.role;
        const { searchCondition, pageInfo } = model;
        const { keyword, category_id, status, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        let query = {};
        if (keyword) {
            const keywordValue = keyword.toLowerCase().trim();
            query = {
                name: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (category_id) {
            query = {
                ...query,
                category_id: new mongoose.Types.ObjectId(category_id),
            };
        }

        query = {
            ...query,
            status: KitStatusEnum.ACTIVE,
        };

        query = itemsQuery(query, { status, is_deleted });

        const aggregateQuery = Kit.aggregate([
            {
                $match: query,
            },
            { $sort: { updated_at: -1 } },
            { $skip: (pageNum - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'labs', // Tìm trong collection 'labs'
                    let: { categoryId: '$category_id' }, // Sử dụng category_id của kit
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$category_id', '$$categoryId'] }  // Điều kiện khớp category_id
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                labCount: { $sum: 1 }, // Đếm số lượng labs
                                labs: { $push: '$$ROOT' } // Lưu danh sách labs
                            },
                        },
                    ],
                    as: 'labs',
                },
            },
            {
                $addFields: {
                    price_paid: {
                        $subtract: [
                            '$price',
                            {
                                $multiply: [
                                    '$price',
                                    {
                                        $cond: {
                                            if: { $lte: ['$discount', 100] },
                                            then: { $divide: ['$discount', 100] },
                                            else: 1,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    instructor_id: '$user._id',
                    instructor_name: '$user.name',
                    category_id: 1,
                    category_name: '$category.name',
                    name: 1,
                    description: 1,
                    status: 1,
                    image_url: 1,
                    video_url: 1,
                    price_paid: 1,
                    price: 1,
                    discount: 1,
                    created_at: 1,
                    updated_at: 1,
                    lab_count: { $ifNull: [{ $arrayElemAt: ['$labs.labCount', 0] }, 0] }, // Số lượng bài lab
                    labs: { $ifNull: [{ $arrayElemAt: ['$labs.labs', 0] }, []] }, // Danh sách bài lab
                    is_in_cart: { $ifNull: ['$is_in_cart', false] },
                    is_purchased: { $ifNull: ['$is_purchased', false] },
                },
            },
        ]);

        // execute the aggregate query
        const items = await aggregateQuery.exec();
    }
}

module.exports = clientService;