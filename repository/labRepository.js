const { Lab } = require("../models");
const mongoose = require('mongoose');

const labRepository = {
    findLabByName: async (name) => {
        return await Lab.findOne({
            name: { $regex: new RegExp('^' + name + '$', 'i') },
            is_deleted: false,
        })
    },

    createLab: async (model) => {
        try {
            return await Lab.create(model);
        } catch (error) {
            console.log(error);
            return;
        }
    },

    addSupportersToLab: async (labId, supporterIds) => {
        const result = await Lab.updateOne(
            { _id: labId },
            { $addToSet: { supporters: { $each: supporterIds } } }
        );
        return result;
    },

    removeSupportersFromLab: async (labId, supporterIds) => {
        return await Lab.updateOne(
            { _id: labId },
            { $pull: { supporters: { $in: supporterIds } } }
        );
    },

    findLabsWithPagination: async (query, pageNum, pageSize) => {
        try {
            const aggregatePipeline = [
                { $match: query },
                { $sort: { updated_at: -1 } },
                { $skip: (pageNum - 1) * pageSize },
                { $limit: pageSize },
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
                        localField: 'supporters',
                        foreignField: '_id',
                        as: 'supporterDetails',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        category_id: 1,
                        category_name: '$category.name',
                        user_id: 1,
                        user_name: '$user.name',
                        description: 1,
                        content: 1,
                        status: 1,
                        lab_url: 1,
                        price: 1,
                        discount: 1,
                        max_support_count: 1,
                        supporterDetails: {
                            _id: 1,
                            name: 1,
                        },
                        created_at: 1,
                        updated_at: 1,
                        is_deleted: 1,
                    },
                },
            ];

            const aggregateQuery = Lab.aggregate(aggregatePipeline);
            const labs = await aggregateQuery.exec();

            // Đếm tổng số kết quả (row count) thỏa mãn query
            const rowCount = await Lab.find(query).countDocuments().exec();

            return { labs, rowCount };
        } catch (error) {
            console.log(error);
        }
    },

    findLabWithUserAndCategoryAndSupporter: async (id) => {
        try {
            return await Lab.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                        is_deleted: false,
                    },
                },
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
                        localField: 'supporters',
                        foreignField: '_id',
                        as: 'supporterDetails',
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: { labId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$product_id', '$$labId'] },
                                            { $eq: ['$product_type', 'lab'] },
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
                        name: 1,
                        category_id: 1,
                        category_name: '$category.name',
                        user_id: 1,
                        user_name: '$user.name',
                        description: 1,
                        content: 1,
                        status: 1,
                        lab_url: 1,
                        price: 1,
                        discount: 1,
                        max_support_count: 1,
                        supporterDetails: {
                            _id: 1,
                            name: 1,
                        },
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
        }
    },


    findLabById: async (id) => {
        return await Lab.findOne({ _id: id, is_deleted: false }).lean();
    },

    updateLab: async (id, updateData) => {
        return await Lab.updateOne({ _id: id }, updateData);
    },

    deleteLab: async (id) => {
        return await Lab.updateOne({ _id: id },
            { is_deleted: true, updated_at: new Date() },)
    }
}

module.exports = labRepository;