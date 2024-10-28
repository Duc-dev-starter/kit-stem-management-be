const { Kit } = require("../models");
const mongoose = require('mongoose');

const kitRepository = {
    findKitByName: async (name) => {
        return await Kit.findOne({
            name: { $regex: new RegExp('^' + name + '$', 'i') },
            is_deleted: false,
        })
    },

    createKit: async (model) => {
        try {
            return await Kit.create(model);
        } catch (error) {
            console.log(error);
            return;
        }
    },

    findKitsWithPagination: async (query, pageNum, pageSize) => {
        try {
            const aggregatePipeline = [
                { $match: query },
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
                    $project: {
                        _id: 1,
                        user_id: 1,
                        user_name: '$user.name',
                        category_id: 1,
                        category_name: '$category.name',
                        name: 1,
                        description: 1,
                        status: 1,
                        image_url: 1,
                        price: 1,
                        discount: 1,
                        lab_count: { $ifNull: [{ $arrayElemAt: ['$labs.labCount', 0] }, 0] }, // Số lượng bài lab
                        labs: { $ifNull: [{ $arrayElemAt: ['$labs.labs', 0] }, []] }, // Danh sách bài lab
                        created_at: 1,
                        updated_at: 1,
                        is_deleted: 1,
                    },
                },
            ];

            const aggregateQuery = Kit.aggregate(aggregatePipeline);
            const kits = await aggregateQuery.exec();
            const rowCount = await Kit.find(query).countDocuments().exec();

            return { kits, rowCount };
        } catch (error) {
            console.log(error);
            return;
        }
    },

    findKitWithUserAndCategoryAndLabs: async (id) => {
        try {
            return await Kit.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                        is_deleted: false,
                    },
                },
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
                        from: 'labs',
                        let: { categoryId: '$category_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$category_id', '$$categoryId'] },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    labCount: { $sum: 1 },
                                    labs: { $push: '$$ROOT' },
                                },
                            },
                        ],
                        as: 'labs',
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: { kitId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$product_id', '$$kitId'] },
                                            { $eq: ['$product_type', 'kit'] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'reviews',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        user_name: '$user.name',
                        category_id: 1,
                        category_name: '$category.name',
                        name: 1,
                        description: 1,
                        status: 1,
                        image_url: 1,
                        price: 1,
                        discount: 1,
                        lab_count: { $ifNull: [{ $arrayElemAt: ['$labs.labCount', 0] }, 0] },
                        labs: { $ifNull: [{ $arrayElemAt: ['$labs.labs', 0] }, []] },
                        reviews: 1, // Thêm mảng reviews vào kết quả
                        created_at: 1,
                        updated_at: 1,
                        is_deleted: 1,
                    },
                },
                { $limit: 1 },
            ]).exec();

        } catch (error) {
            console.log(error);
            return;
        }
    },


    findKitById: async (id) => {
        return await Kit.findOne({ _id: id, is_deleted: false }).lean();
    },

    changeStatusKit: async (kit_id, new_status) => {
        return await Kit.updateOne(
            { _id: kit_id },
            { status: new_status, updated_at: new Date() },
        );

    },

    updateKit: async (id, updateData) => {
        return await Kit.updateOne({ _id: id }, updateData);
    },

    deleteKit: async (id) => {
        return await Kit.updateOne(
            { _id: id },
            { is_deleted: true, updated_at: new Date() },
        );
    }
}

module.exports = kitRepository;