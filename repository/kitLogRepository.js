const { KitLog } = require("../models");

const kitLogRepository = {
    findKitLogsWithPagination: async (query, pageNum, pageSize) => {
        const aggregatePipeline = [{ $match: query }];
        aggregatePipeline.push(
            { $sort: { created_at: -1 } },
            { $skip: (pageNum - 1) * pageSize },
            { $limit: pageSize },
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
                $lookup: {
                    from: 'kits',
                    localField: 'kit_id',
                    foreignField: '_id',
                    as: 'kit',
                },
            },
            { $unwind: '$kit' },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    user_name: '$user.name',
                    kit_id: 1,
                    kit_name: '$kit.name',
                    comment: 1,
                    old_status: 1,
                    new_status: 1,
                    created_at: 1,
                    updated_at: 1,
                    is_deleted: 1,
                },
            }
        );

        const aggregateQuery = KitLog.aggregate(aggregatePipeline);
        const kitLogs = await aggregateQuery.exec();
        const rowCount = await KitLog.find(query).countDocuments().exec();

        return { kitLogs, rowCount };
    },

    createKitLog: async (newLogs) => {
        try {
            return await KitLog.create(newLogs);
        } catch (error) {
            console.log(error);
            return;
        }
    },


}

module.exports = kitLogRepository;