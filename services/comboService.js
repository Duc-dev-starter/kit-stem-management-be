const { default: mongoose } = require("mongoose");
const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { comboRepository, categoryRepository, kitRepository, labRepository } = require("../repository");
const { isEmptyObject, formatPaginationData, checkUserMatch } = require("../utils");

const comboService = {

    createCombo: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const { name, items, price, discount, description, category_id, image_url } = model;

        if (!items || items.length === 0) {
            throw new HttpException(HttpStatus.BadRequest, 'Combo must contain at least one item');
        }

        const categoryExists = await categoryRepository.findCategoryById(category_id);
        if (!categoryExists) {
            throw new HttpException(HttpStatus.BadRequest, `Invalid category_id: ${category_id}`);
        }

        const existingCombo = await comboRepository.findComboByName(name);
        if (existingCombo) {
            throw new HttpException(HttpStatus.BadRequest, `Combo with name "${name}" already exists`);
        }

        for (const item of items) {
            if (!['kit', 'lab'].includes(item.itemType)) {
                throw new HttpException(HttpStatus.BadRequest, `Invalid itemType: ${item.itemType}`);
            }

            const isValid = await comboRepository.isValidItem(item);
            if (!isValid) {
                throw new HttpException(HttpStatus.BadRequest, `Invalid itemId for type ${item.itemType}: ${item.itemId}`);
            }
        }

        // Kiểm tra trùng lặp các items trong combo khác
        const existingComboWithSameItems = await comboRepository.findComboByItems(items);
        if (existingComboWithSameItems) {
            throw new HttpException(HttpStatus.BadRequest, 'A combo with the same items already exists');
        }

        // Xử lý giảm giá và logic khác nếu cần
        const finalDiscount = discount || 0;

        // Tạo combo mới qua repository
        const newCombo = await comboRepository.createCombo({
            name,
            items,
            price,
            image_url,
            discount: finalDiscount,
            description,
            category_id
        });

        if (!newCombo) {
            throw new HttpException(HttpStatus.Accepted, 'Create combo failed');
        }

        return newCombo;
    },

    getCombo: async (id) => {
        const combo = await comboRepository.findComboWithUserAndCategory(id);
        if (!combo || combo.length === 0) {
            throw new HttpException(HttpStatus.NotFound, `Combo is not exists.`);
        }
        return combo[0];
    },

    getCombos: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const { searchCondition, pageInfo } = model;
        const { keyword, category_id, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        // Construct search query based on the searchCondition fields
        let query = { is_deleted };

        if (keyword) {
            query.name = { $regex: keyword.toLowerCase().trim(), $options: 'i' };
        }

        if (category_id && mongoose.Types.ObjectId.isValid(category_id)) {
            query = {
                ...query,
                category_id: new mongoose.Types.ObjectId(category_id),
            };
        } else if (category_id) {
            throw new HttpException(HttpStatus.BadRequest, 'Invalid category ID');
        }
        console.log(query)
        // Get total items count for pagination
        const totalItems = await comboRepository.countCombos(query);

        // Find combos with pagination
        let combos = await comboRepository.findCombosWithPagination(query, pageNum, pageSize);

        // Map through each combo to add category name and fetch kit/lab details
        combos = await Promise.all(combos.map(async (combo) => {
            // Fetch the category name
            const category = await categoryRepository.findCategoryById(combo.category_id);
            combo.category_name = category ? category.name : null;

            // Fetch details for each item in combo.items
            combo.items = await Promise.all(combo.items.map(async (item) => {
                const itemDetails = await (item.itemType === 'kit'
                    ? kitRepository.findKitById(item.itemId)
                    : labRepository.findLabById(item.itemId)
                );
                return {
                    ...item,
                    details: itemDetails || null
                };
            }));

            return combo;
        }));

        return formatPaginationData(combos, pageNum, pageSize, totalItems);
    },

    updateCombo: async (id, model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const errorResults = [];

        // Kiểm tra combo có tồn tại không
        const combo = await comboRepository.findComboById(id);
        if (combo && combo.user_id) {
            // Kiểm tra quyền người dùng
            checkUserMatch(userId, combo.user_id.toString(), 'combo');
        } else {
            throw new HttpException(HttpStatus.BadRequest, 'Combo does not exist.');
        }

        // Kiểm tra danh mục hợp lệ
        const category = await categoryRepository.findCategoryById(model.category_id);
        if (!category) {
            errorResults.push({
                message: 'Category does not exist.',
                field: 'category_id',
            });
        }

        // Kiểm tra trùng lặp tên combo
        if (combo.name.toLowerCase() !== model.name.toLowerCase()) {
            const itemDuplicate = await comboRepository.findComboByName(model.name);
            if (itemDuplicate) {
                errorResults.push({
                    message: `Combo with name '${model.name}' already exists!`,
                    field: 'name'
                });
            }
        }

        // Kiểm tra giảm giá nằm trong khoảng hợp lệ (0-100)
        if (model.discount < 0 || model.discount > 100) {
            errorResults.push({
                message: 'Please enter discount in range 0-100!',
                field: 'discount',
            });
        }

        // Kiểm tra danh sách `items`
        if (model.items && model.items.length > 0) {
            for (const item of model.items) {
                if (!['kit', 'lab'].includes(item.itemType)) {
                    errorResults.push({
                        message: `Invalid itemType: ${item.itemType}`,
                        field: 'items',
                    });
                } else {
                    const isValid = await comboRepository.isValidItem(item);
                    if (!isValid) {
                        errorResults.push({
                            message: `Invalid itemId for type ${item.itemType}: ${item.itemId}`,
                            field: 'items',
                        });
                    }
                }
            }


            // Kiểm tra các phần tử `items` trùng lặp với các combo khác
            console.log(model.items)
            const existingComboWithSameItems = await comboRepository.findComboByItems(model.items, id);
            console.log(existingComboWithSameItems)
            if (existingComboWithSameItems && existingComboWithSameItems._id.toString() !== id) {
                errorResults.push({
                    message: 'A combo with the same items already exists.',
                    field: 'items',
                });
            }
        } else {
            errorResults.push({
                message: 'Combo must contain at least one item.',
                field: 'items',
            });
        }

        console.log('test items')


        // Kiểm tra các trường hợp lỗi
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BadRequest, '', errorResults);
        }

        // Cập nhật combo mới qua repository
        const updatedCombo = await comboRepository.updateCombo(id, {
            ...model,
            updated_at: new Date(),
        });

        if (!updatedCombo) {
            throw new HttpException(HttpStatus.Accepted, 'Failed to update combo');
        }

        const result = await comboRepository.findComboById(id);
        return result;
    },


    deleteCombo: async (id, userId) => {
        const combo = await comboRepository.findComboById(id);

        if (!combo || combo.is_deleted) {
            throw new HttpException(HttpStatus.BadRequest, `Combo is not exists.`);
        }

        if (combo && combo.user_id) {
            // check valid user
            checkUserMatch(userId, combo.user_id.toString(), 'combo');
        }

        const updatedCombo = await comboRepository.deleteCombo(id);

        if (!updatedCombo.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete combo failed!');
        }

        return true;
    },

}

module.exports = comboService