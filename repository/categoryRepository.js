const { Category } = require("../models");

const categoryRepository = {
    findCategoryByName: async (name) => {
        return await Category.findOne({
            name: { $regex: new RegExp('^' + name + '$', 'i') },
            is_deleted: false,
        })
    },
    createCategory: async (model) => {
        return await Category.create(model);
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
    },
}

module.exports = categoryRepository;