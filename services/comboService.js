const { default: mongoose } = require("mongoose");
const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { comboRepository, categoryRepository, kitRepository, labRepository } = require("../repository");
const { isEmptyObject, formatPaginationData } = require("../utils");

const comboService = {

    createCombo: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const { name, items, price, discount, description, category_id } = model;

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
            throw new HttpException(HttpStatus.BadRequest, `Combo is not exists.`);
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
    }



}

module.exports = comboService