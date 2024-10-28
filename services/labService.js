const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { categoryRepository, labRepository, userRepository } = require("../repository");
const { isEmptyObject, checkValidUrl, checkUserMatch, itemsQuery, formatPaginationData } = require("../utils");
const mongoose = require('mongoose');

const labService = {
    create: async (model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const errorResults = [];

        model.user_id = userId;
        delete model.status;
        // check category valid
        const category = await categoryRepository.findCategoryById(model.category_id)
        if (!category) {
            errorResults.push({
                message: `Category is not exists.`,
                field: 'category_id',
            });
        }

        // check name duplicates
        const lab = await labRepository.findLabByName(model.name)
        if (lab) {
            errorResults.push({
                message: `Lab with name is '${model.name}' already exists!`,
                field: 'name',
            });
        }


        if (!model.lab_url) {
            errorResults.push({
                message: `Please provide lab_url url!`,
                field: 'lab_url',
            });
        }

        if (model.lab_url && !checkValidUrl(model.lab_url)) {
            throw new HttpException(HttpStatus.BadRequest, `The URL '${model.lab_url}' is not valid`);
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

        const createdLab = await labRepository.createLab(model);
        if (!createdLab) {
            throw new HttpException(HttpStatus.Accepted, `Create lab failed!`);
        }
        return createdLab;
    },

    addSupportersToLab: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const errorResults = [];

        const labId = model.labId;
        const supporterIds = model.supporterIds;

        // check if lab exits
        const lab = await labRepository.findLabById(labId);
        if (!lab) {
            throw new HttpException(HttpStatus.BadRequest, `The Lab is not valid`);
        }

        const currentSupporters = lab.supporters || [];

        // Validate new supporters
        const validSupporters = [];
        for (const supporterId of supporterIds) {
            const supporter = await userRepository.findById(supporterId);
            if (!supporter) {
                errorResults.push({
                    message: `Supporter with ID ${supporterId} does not exist!`,
                    field: 'supporterIds',
                });
            } else if (supporter.role !== 'staff') {
                errorResults.push({
                    message: `User with ID ${supporterId} is not a staff member!`,
                    field: 'supporterIds',
                });
            } else if (currentSupporters.some(currentId => currentId.equals(supporterId))) {
                errorResults.push({
                    message: `Supporter with ID ${supporterId} is already assigned to this lab!`,
                    field: 'supporterIds',
                });
            } else {
                validSupporters.push(supporterId);
            }
        }
        if (errorResults.length > 0) {
            throw new HttpException(HttpStatus.BadRequest, 'Validation Error', errorResults);
        }

        const updatedLab = await labRepository.addSupportersToLab(labId, supporterIds);

        if (updatedLab.nModified === 0) {
            throw new Error('Failed to add supporters or no changes made to the lab');
        }

        const detail = await labRepository.findLabById(labId);

        return detail;
    },

    removeSupportersFromLab: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const errorResults = [];
        const labId = model.labId;
        const supporterIds = model.supporterIds;

        // Check if lab exists
        const lab = await labRepository.findLabById(labId);
        if (!lab) {
            throw new HttpException(HttpStatus.BadRequest, `The Lab is not valid`);
        }

        const currentSupporters = lab.supporters || [];

        // Validate supporters to be removed
        const validSupporters = [];
        for (const supporterId of supporterIds) {
            const supporter = await userRepository.findById(supporterId);
            if (!supporter) {
                errorResults.push({
                    message: `Supporter with ID ${supporterId} does not exist!`,
                    field: 'supporterIds',
                });
            } else if (currentSupporters.every(currentId => !currentId.equals(supporterId))) {
                errorResults.push({
                    message: `Supporter with ID ${supporterId} is not assigned to this lab!`,
                    field: 'supporterIds',
                });
            } else {
                validSupporters.push(supporterId);
            }
        }

        if (errorResults.length > 0) {
            throw new HttpException(HttpStatus.BadRequest, 'Validation Error', errorResults);
        }

        // Remove supporters from lab
        const updatedLab = await labRepository.removeSupportersFromLab(labId, validSupporters);

        if (updatedLab.nModified === 0) {
            throw new Error('Failed to remove supporters or no changes made to the lab');
        }

        return true;
    },

    getLabs: async (model) => {
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

        const { labs, rowCount } = await labRepository.findLabsWithPagination(query, pageNum, pageSize);
        return formatPaginationData(labs, pageNum, pageSize, rowCount);
    },

    getLab: async (id) => {
        const lab = await labRepository.findLabWithUserAndCategoryAndSupporter(id);
        if (!lab || lab.length === 0) {
            throw new HttpException(HttpStatus.BadRequest, `Lab is not exists.`);
        }
        return lab[0];
    },

    updateLab: async (id, model, userId) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const errorResults = [];

        // check item exits
        const lab = await labRepository.findLabById(id);
        if (lab && lab.user_id) {
            // check valid user
            checkUserMatch(userId, lab.user_id.toString(), 'lab');
        } else {
            throw new HttpException(HttpStatus.BadRequest, `Lab is not exists.`);
        }

        // check category valid
        const category = await categoryRepository.findCategoryById(model.category_id);
        if (!category) {
            errorResults.push({
                message: `Category is not exists.`,
                field: 'category_id',
            });
        }

        // check name duplicates
        if (lab.name.toLowerCase() !== model.name.toLowerCase()) {
            const itemDuplicate = await labRepository.findLabByName(model.name);
            if (itemDuplicate) {
                errorResults.push({ message: `Lab with name is '${model.name}' already exists!`, field: 'name' });
            }
        }

        if (!model.lab_url) {
            errorResults.push({
                message: `Please provide lab_url url!`,
                field: 'lab_url',
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
            lab_url: model.lab_url,
            price: model.price,
            discount: model.discount,
            updated_at: new Date(),
        };

        const updatedItem = await labRepository.updateLab(id, updateData);

        if (!updatedItem.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update lab info failed!');
        }

        const result = await labRepository.findLabById(id);
        return result;
    },
    deleteLab: async (id, userId) => {
        const lab = await labRepository.findLabById(id);
        if (!lab || lab.is_deleted) {
            throw new HttpException(HttpStatus.BadRequest, `Lab is not exists.`);
        }

        if (lab && lab.user_id) {
            // check valid user
            checkUserMatch(userId, lab.user_id.toString(), 'lab');
        }

        const updatedLab = await labRepository.deleteLab(id);

        if (!updatedLab.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete lab failed!');
        }

        return true;
    }
}

module.exports = labService;