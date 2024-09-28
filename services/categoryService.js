const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { categoryRepository } = require("../repository");
const { isEmptyObject, formatPaginationData } = require("../utils");

const categoryService = {
    create: async (model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const errorResults = [];

        const newModel = {
            parent_category_id: model.parent_category_id || null,
            ...model,
        }

        //check name valid
        const category = await categoryRepository.findCategoryByName(newModel);
        if (category) {
            errorResults.push({
                message: `Category with name is '${newModel.name}' already exists!`,
                field: 'name',
            });
        }

        if (model.parent_category_id) {
            const itemParent = await categoryRepository.findCategoryById(model.parent_category_id);
            if (itemParent.parent_category_id) {
                errorResults.push({
                    message: `The selected category with name is '${itemParent.name}' cannot be used as a parent category!`,
                    field: 'parent_category_id',
                });
            }
        }

        // check valid
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BadRequest, '', errorResults);
        }

        newModel.user_id = userId;
        const createdCategory = await categoryRepository.createCategory(newModel);
        if (!createdCategory) {
            throw new HttpException(HttpStatus.Accepted, `Create category failed!`);
        }
        return createdCategory;
    },
    getCategories: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const { searchCondition, pageInfo } = model;
        const { keyword, is_parent, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        // Tạo điều kiện tìm kiếm từ searchCondition
        let query = {};

        if (keyword) {
            const keywordValue = keyword.toLowerCase().trim();
            query = {
                name: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (is_parent) {
            query = {
                ...query,
                parent_category_id: null,
            };
        }

        query = {
            ...query,
            is_deleted,
        };
        // Tính toán số lượng trang
        const totalItems = await categoryRepository.countCategory(query);

        const categories = await categoryRepository.findCategoriesWithPagination(query, pageNum, pageSize);
        return formatPaginationData(categories, pageNum, pageSize, totalItems);
    },
    getCategory: async (id) => {
        const category = await categoryRepository.findCategoryWithUser(id);
        if (!category) {
            throw new HttpException(HttpStatus.BadRequest, `Category is not exists.`);
        }
        return category;
    },
    updateCategory: async (id, model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const errorResults = [];

        // check item exits
        const item = await categoryRepository.findCategoryById(id);

        // check name duplicates
        if (item.name.toLowerCase() !== model.name.toLowerCase()) {
            const category = await categoryRepository.findCategoryByName(model.name);
            if (category) {
                errorResults.push({ message: `Category with name is '${model.name}' already exists!`, field: 'name' });
            }
        }

        // check valid
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BadRequest, '', errorResults);
        }

        const updateData = {
            name: model.name,
            updated_at: new Date(),
        };

        const updatedItem = await categoryRepository.updateCategory(id, updateData);

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update category info failed!');
        }

        const result = await categoryRepository.findCategoryById(id);
        return result;
    },
    deleteCategory: async (id) => {
        const detail = await categoryRepository.findCategoryById(id);
        if (!detail || detail.is_deleted) {
            throw new HttpException(HttpStatus.BadRequest, `Category is not exists.`);
        }

        const updatedItem = await categoryRepository.deleteCategory(id);

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete category failed!');
        }

        return true;
    }



}

module.exports = categoryService;