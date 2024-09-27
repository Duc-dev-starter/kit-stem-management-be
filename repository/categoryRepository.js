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
        const skip = (pageNum - 1) * pageSize;

        return await Category.aggregate([
            {
                $match: {
                    ...query,
                    is_deleted: false,
                },
            },
            {
                $lookup: {
                    from: 'users', // Tên collection của users
                    localField: 'user_id', // Trường trong collection category
                    foreignField: '_id', // Trường trong collection users
                    as: 'user', // Tên trường mới sẽ chứa thông tin người dùng
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true, // Giữ lại category nếu không tìm thấy người dùng
                },
            },
            {
                $addFields: {
                    user_name: '$user.name', // Giả sử tên trường trong collection users là 'name'
                },
            },
            {
                $project: {
                    user_info: 0, // Bỏ qua trường user_info nếu không cần
                },
            },
            {
                $sort: { updated_at: -1 }, // Sắp xếp theo updated_at giảm dần
            },
            {
                $skip: skip, // Phân trang
            },
            {
                $limit: pageSize, // Giới hạn số lượng kết quả
            },

        ]);
    },
}

module.exports = categoryRepository;