const { HttpStatus, UserRoleEnum } = require("../consts");
const HttpException = require("../exception");
const { kitRepository, kitLogRepository } = require("../repository");
const { isEmptyObject, itemsQuery, formatPaginationData } = require("../utils");
const mongoose = require('mongoose');

const kitLogService = {
    getKitLogs: async (model, userRole) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const { searchCondition, pageInfo } = model;
        const { kit_id, keyword, old_status, new_status, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        // check user permissions
        if (userRole !== UserRoleEnum.STAFF && userRole !== UserRoleEnum.MANAGER) {
            throw new HttpException(HttpStatus.BadRequest, 'You does not have permission view kit logs.');
        }

        // check kit exist
        const kit = await kitRepository.findKitById(kit_id);
        if (!kit) {
            throw new HttpException(HttpStatus.BadRequest, 'Kit is not exist.');
        }

        let query = {};

        if (keyword) {
            const keywordValue = keyword.toLowerCase().trim();
            query = {
                comment: { $regex: keywordValue, $options: 'i' },
            };
        }

        query = itemsQuery(query, { old_status, new_status, is_deleted });

        query = {
            ...query,
            kit_id: new mongoose.Types.ObjectId(kit_id),
        };

        // Gọi repository để tìm kit logs
        const { kitLogs, rowCount } = await kitLogRepository.findKitLogsWithPagination(query, pageNum, pageSize);

        return formatPaginationData(kitLogs, pageNum, pageSize, rowCount);

    }
}

module.exports = kitLogService;