const { HttpStatus, UserRoleEnum, VALID_STATUS_CHANGE_PAIRS, KitStatus, KitStatusEnum, REQUIRED_COMMENT_STATUSES } = require("../consts");
const HttpException = require("../exception");
const { categoryRepository, kitRepository, kitLogRepository } = require("../repository");
const { isEmptyObject, checkValidUrl, checkUserMatch, itemsQuery, formatPaginationData } = require("../utils");
const mongoose = require('mongoose');

const kitService = {
    create: async (model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        model.user_id = userId;
        delete model.status;
        const errorResults = [];

        // check category valid
        const category = await categoryRepository.findCategoryById(model.category_id)
        if (!category) {
            errorResults.push({
                message: `Category is not exists.`,
                field: 'category_id',
            });
        }

        // check name duplicates
        const item = await kitRepository.findKitByName(model.name);
        if (item) {
            errorResults.push({
                message: `Kit with name is '${model.name}' already exists!`,
                field: 'name',
            });
        }

        if (!model.image_url && !model.video_url) {
            errorResults.push({
                message: `Please provide image_url url or video_url url!`,
                field: 'video_url',
            });
        }

        if (model.image_url && !checkValidUrl(model.image_url)) {
            throw new HttpException(HttpStatus.BadRequest, `The URL '${model.image_url}' is not valid`);
        }

        if (model.video_url && !checkValidUrl(model.video_url)) {
            throw new HttpException(HttpStatus.BadRequest, `The URL '${model.video_url}' is not valid`);
        }

        if (model.discount < 0 || model.discount > 100) {
            errorResults.push({
                message: `Please enter discount in range 0-100!`,
                field: 'discount',
            });
        }

        // check valid
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BadRequest, '', errorResults);
        }

        const createdItem = await kitRepository.createKit(model);
        if (!createdItem) {
            throw new HttpException(HttpStatus.Accepted, `Create kit failed!`);
        }
        return createdItem;

    },

    getKits: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const { searchCondition, pageInfo } = model;
        const { keyword, category_id, status, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        let query = {};
        if (keyword) {
            const keywordValue = keyword.toLowerCase().trim();
            query = {
                name: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (category_id) {
            query = {
                ...query,
                category_id: new mongoose.Types.ObjectId(category_id),
            };
        }


        query = itemsQuery(query, { status, is_deleted });

        const { kits, rowCount } = await kitRepository.findKitsWithPagination(query, pageNum, pageSize);
        return formatPaginationData(kits, pageNum, pageSize, rowCount);
    },

    getKit: async (id) => {
        const detail = await kitRepository.findKitWithUserAndCategoryAndLabs(id);
        if (!detail) {
            throw new HttpException(HttpStatus.BadRequest, `Kit is not exists.`);
        }
        console.log(detail[0])
        return detail[0];
    },

    changeStatusKit: async (model, user) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }


        const userId = user.id;
        const { kit_id, new_status, comment } = model;
        // check item exits
        const kit = await kitRepository.findKitById(kit_id);
        if (!kit) {
            throw new HttpException(HttpStatus.NotFound, 'Kit not found');
        }
        if (kit && kit.user_id) {
            // check valid user
            checkUserMatch(userId, kit.user_id.toString(), 'kit');
        }

        const old_status = kit.status;

        if (new_status === old_status) {
            throw new HttpException(HttpStatus.BadRequest, `This kit has already with status is ${old_status}`);
        }

        const isValidChangeStatus = VALID_STATUS_CHANGE_PAIRS.some(
            (pair) => pair[0] === old_status && pair[1] === new_status,
        );

        if (!isValidChangeStatus) {
            throw new HttpException(
                HttpStatus.BadRequest,
                `Invalid status change. Current status: ${old_status} -> ${new_status}`,
            );
        }

        if (REQUIRED_COMMENT_STATUSES.includes(new_status) && !comment) {
            throw new HttpException(HttpStatus.BadRequest, `Please provide a comment for the reason of changing status to ${new_status}!`);
        }

        const updatedItem = await kitRepository.changeStatusKit(kit_id, new_status);

        const newLogs = await kitLogRepository.createKitLog({
            user_id: userId,
            kit_id,
            old_status,
            new_status,
            comment,
            created_at: new Date(),
            is_deleted: false,
        })

        if (!newLogs) {
            throw new HttpException(HttpStatus.BadRequest, `Update item log info failed!`);
        }

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update item info failed!');
        }

        const result = await kitRepository.findKitById(kit_id);
        return result;
    },

    updateKit: async (id, model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const errorResults = [];

        // check item exits
        const kit = await kitRepository.findKitById(id);
        if (kit && kit.user_id) {
            // check valid user
            checkUserMatch(userId, kit.user_id.toString(), 'kit');
        } else {
            throw new HttpException(HttpStatus.BadRequest, `Kit is not exists.`);
        }

        // check category valid
        const category = await categoryRepository.findCategoryById(model.category_id)
        if (!category) {
            errorResults.push({
                message: `Category is not exists.`,
                field: 'category_id',
            });
        }

        // check name duplicates
        if (kit.name.toLowerCase() !== kit.name.toLowerCase()) {
            const itemDuplicate = await kitRepository.findKitByName(model.name);
            if (itemDuplicate) {
                errorResults.push({ message: `Kit with name is '${model.name}' already exists!`, field: 'name' });
            }
        }

        if (!model.image_url && !model.video_url) {
            errorResults.push({
                message: `Please provide image_url url or video_url url!`,
                field: 'video_url',
            });
        }

        if (model.discount < 0 || model.discount > 100) {
            errorResults.push({
                message: `Please enter discount in range 0-100!`,
                field: 'discount',
            });
        }

        // check valid
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BadRequest, '', errorResults);
        }

        const updateData = {
            name: model.name,
            category_id: model.category_id,
            description: model.description,
            content: model.content,
            video_url: model.video_url,
            image_url: model.image_url,
            price: model.price,
            discount: model.discount,
            updated_at: new Date(),
        };

        const updatedItem = await kitRepository.updateKit(id, updateData);

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update item info failed!');
        }

        const result = await kitRepository.findKitById(id);
        return result;
    },

    deleteKit: async (id, userId) => {
        const kit = await kitRepository.findKitById(id);

        if (!kit || kit.is_deleted) {
            throw new HttpException(HttpStatus.BadRequest, `Kit is not exists.`);
        }

        if (kit && kit.user_id) {
            // check valid user
            checkUserMatch(userId, kit.user_id.toString(), 'kit');
        }

        const updatedKit = await kitRepository.deleteKit(id);

        if (!updatedKit.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete kit failed!');
        }

        return true;
    },
}

module.exports = kitService;