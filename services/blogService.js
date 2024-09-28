const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { categoryRepository, blogRepository } = require("../repository");
const { isEmptyObject, checkValidUrl, itemsQuery, formatPaginationData } = require("../utils");
const mongoose = require('mongoose');

const blogService = {
    create: async (model, user) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        model.user_id = user.id;

        // check category exist
        const categoryExist = await categoryRepository.findCategoryById(model.category_id);

        if (!categoryExist) {
            throw new HttpException(HttpStatus.BadRequest, `Category not found!`);
        }

        // check name duplicates
        const blogExist = await blogRepository.findBlogByTitle(model.title);

        if (blogExist) {
            throw new HttpException(HttpStatus.BadRequest, `Blog with this name '${model.title}' already exists`);
        }

        if (!checkValidUrl(model.image_url)) {
            throw new HttpException(HttpStatus.BadRequest, `The URL '${model.image_url}' is not valid`);
        }

        const createdItem = await blogRepository.createBlog(model);
        if (!createdItem) {
            throw new HttpException(HttpStatus.Accepted, `Create item failed!`);
        }
        return createdItem;
    },

    getBlogs: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const { searchCondition, pageInfo } = model;
        const { category_id, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        // Tạo điều kiện tìm kiếm từ searchCondition
        let query = {};

        if (category_id && mongoose.Types.ObjectId.isValid(category_id)) {
            query = {
                ...query,
                category_id: new mongoose.Types.ObjectId(category_id),
            };
        } else if (category_id) {
            throw new HttpException(HttpStatus.BadRequest, 'Invalid category ID');
        }

        query = itemsQuery(query, { is_deleted });

        const { blogs, rowCount } = await blogRepository.findBlogsWithPagination(query, pageNum, pageSize);

        return formatPaginationData(blogs, pageNum, pageSize, rowCount);
    },

    getBlog: async (id) => {
        const detail = await blogRepository.findBlogWithUserAndCategory(id);

        if (!detail || detail.length === 0) {
            throw new HttpException(HttpStatus.BadRequest, `Blog is not exists.`);
        }
        return detail[0];
    },

    updateBlog: async (id, model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        // check item exist
        const detail = await blogRepository.findBlogById(id);
        if (!detail) {
            throw new HttpException(HttpStatus.BadRequest, `Blog is not exists.`);
        }

        if (model.category_id !== detail.category_id) {
            // check category exist
            const categoryExist = await categoryRepository.findCategoryById(model.category_id);
            if (!categoryExist) {
                throw new HttpException(HttpStatus.BadRequest, `Category not found!`);
            }
        }

        if (model.title.toLocaleLowerCase() !== detail.title.toLocaleLowerCase()) {
            // check name duplicates
            const blogExist = await blogRepository.findBlogByTitle(model.title)
            if (blogExist) {
                throw new HttpException(HttpStatus.BadRequest, `Blog with this name '${model.title}' already exists`);
            }
        }

        if (!checkValidUrl(model.image_url)) {
            throw new HttpException(HttpStatus.BadRequest, `The URL '${model.image_url}' is not valid`);
        }

        const updateData = {
            title: model.title,
            category_id: model.category_id,
            image_url: model.image_url,
            description: model.description,
            content: model.content,
            updated_at: new Date(),
        };

        const updatedItem = await blogRepository.updateBlog(id, updateData);

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update item info failed!');
        }

        const result = await blogRepository.findBlogById(id);
        return result;
    },

    deleteBlog: async (id) => {
        const item = await blogRepository.findBlogById(id);
        if (!item || item.is_deleted) {
            throw new HttpException(HttpStatus.BadRequest, `Category is not exists.`);
        }
        const updatedItem = await blogRepository.deleteBlog(id);

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete item failed!');
        }

        return true;
    }
}

module.exports = blogService;