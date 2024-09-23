const { Blog } = require("../models");
const mongoose = require('mongoose');

const blogRepository = {
    createBlog: async (model) => {
        return await Blog.create(model);
    },

    findBlogByTitle: async (title) => {
        return await Blog.findOne({
            title: { $regex: new RegExp('^' + title + '$', 'i') },
            is_deleted: false,
        });
    },

    findBlogsWithPagination: async (query, pageNum, pageSize) => {
        const aggregatePipeline = [{ $match: query }];
        aggregatePipeline.push(
            { $sort: { created_at: -1 } },
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
                $project: {
                    _id: 1,
                    title: 1,
                    user_id: 1,
                    user_name: '$user.name',
                    category_id: 1,
                    category_name: '$category.name',
                    image_url: 1,
                    description: 1,
                    content: 1,
                    created_at: 1,
                    updated_at: 1,
                    is_deleted: 1,
                },
            }
        );

        const aggregateQuery = Blog.aggregate(aggregatePipeline);
        const blogs = await aggregateQuery.exec();
        const rowCount = await Blog.find(query).countDocuments().exec();

        return { blogs, rowCount };
    },

    findBlogWithUserAndCategory: async (id) => {
        return await Blog.aggregate([
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
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    user_id: 1,
                    user_name: '$user.name',
                    category_id: 1,
                    category_name: '$category.name',
                    image_url: 1,
                    description: 1,
                    content: 1,
                    created_at: 1,
                    updated_at: 1,
                    is_deleted: 1,
                },
            },
            { $limit: 1 },
        ])
            .exec();
    },

    findBlogById: async (id) => {
        return await Blog.findOne({ _id: id, is_deleted: false });
    },

    updateBlog: async (id, updateData) => {
        return await Blog.updateOne({ _id: id }, updateData)
    },

    deleteBlog: async (id) => {
        return await Blog.updateOne({ _id: id }, { is_deleted: true, updated_at: new Date() });
    }
}

module.exports = blogRepository