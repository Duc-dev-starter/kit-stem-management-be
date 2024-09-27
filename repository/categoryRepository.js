const mongoose = require("mongoose");
const { Category } = require("../models");

const categoryRepository = {
    findCategoryByName: async (name) => {
        return await Category.findOne({
            name: { $regex: new RegExp('^' + name + '$', 'i') },
            is_deleted: false,
        })
    },
    createCategory: async (model) => {
        try {
            return await Category.create(model);
        } catch (error) {
            console.log(error);
        }
    },
    findCategoryWithUser: async (id) => {
        return await Category.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    is_deleted: false, // Chỉ lấy các category không bị xóa
                },
            },
            {
                $lookup: {
                    from: 'users', // Tên collection của users
                    localField: 'user_id', // Trường trong collection category
                    foreignField: '_id', // Trường trong collection users
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true, // Giữ lại category nếu không tìm thấy người dùng
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    user_id: 1,
                    user_name: '$user.name', // Lấy tên người dùng
                    parent_category_id: 1,
                    is_deleted: 1,
                    created_at: 1,
                    updated_at: 1,
                },
            },
            { $limit: 1 },
        ]).exec();

    },
    findCategoryById: async (id) => {
        return await Category.findOne({ _id: id, is_deleted: false }).lean();
    },
    updateCategory: async (id, userData) => {
        return await Category.updateOne({ _id: id }, userData);
    },
    deleteCategory: async (id) => {
        return await Category.updateOne({ _id: id }, { is_deleted: true, updated_at: new Date() })
    },
    countCategory: async (query) => {
        return await Category.find(query).countDocuments().exec();
    },
    findCategoriesWithPagination: async (query, pageNum, pageSize) => {
        return await Category.find(query)
            .find(query)
            .sort({ updated_at: -1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .exec();
    }
}

module.exports = categoryRepository;