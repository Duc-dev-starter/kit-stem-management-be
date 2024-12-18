const { default: mongoose } = require("mongoose");
const { Kit, Lab, Combo } = require("../models");

const comboRepository = {
    createCombo: async (data) => {
        try {
            return await Combo.create(data);
        } catch (error) {
            console.log(error);
            return;
        }
    },

    findComboByItems: async (items, excludeId = null) => {
        // Tạo điều kiện tìm kiếm cho từng `itemId` và `itemType` trong `items` của combo mới
        const itemConditions = items.map(item => ({
            "items.itemId": item.itemId,
            "items.itemType": item.itemType
        }));

        // Xây dựng điều kiện tìm kiếm chính
        const query = {
            $and: itemConditions
        };

        // Nếu đang cập nhật, loại trừ combo hiện tại
        if (excludeId) {
            query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
        }

        // Tìm combo trùng lặp với các `items`
        const combo = await Combo.findOne(query);
        return combo;
    },


    isValidItem: async (item) => {
        const itemModel = item.itemType === 'kit' ? Kit : Lab;
        return await itemModel.exists({ _id: item.itemId });
    },

    findComboById: async (id) => {
        return Combo.findById(id)
    },

    findComboByName: async (name) => {
        return Combo.findOne({ name })
    },

    findCombosWithPagination: async (query, pageNum, pageSize) => {
        try {
            const skip = (pageNum - 1) * pageSize;
            return await Combo.find(query)
                .skip(skip)
                .limit(pageSize)
                .lean();  // Use .lean() to improve performance if no virtuals or methods are needed
        } catch (error) {
            throw new Error(`Error finding combos with pagination: ${error.message}`);
        }
    },

    findComboWithUserAndCategory: async (id) => {
        try {
            const combo = await Combo.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                        is_deleted: false,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'categoryDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$categoryDetails',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: { comboId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$product_id', '$$comboId'] },
                                            { $eq: ['$product_type', 'combo'] },
                                        ],
                                    },
                                },
                            },
                            // Lookup to get user names for reviews
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'user_id',
                                    foreignField: '_id',
                                    as: 'reviewer',
                                },
                            },
                            {
                                $unwind: { path: '$reviewer', preserveNullAndEmptyArrays: true },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    comment: 1,
                                    rating: 1,
                                    created_at: 1,
                                    user_name: '$reviewer.name', // Get the user's name from the reviewer
                                },
                            },
                        ],
                        as: 'reviews',
                    },
                },
                {
                    $lookup: {
                        from: 'kits',
                        localField: 'items.itemId',
                        foreignField: '_id',
                        as: 'kitDetails',
                    },
                },
                {
                    $lookup: {
                        from: 'labs',
                        localField: 'items.itemId',
                        foreignField: '_id',
                        as: 'labDetails',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        price: 1,
                        discount: 1,
                        reviews: 1, // Include the enriched reviews
                        quantity: 1,
                        category_id: '$category_id',
                        category_name: '$categoryDetails.name',
                        user_id: '$user_id',
                        user_name: '$userDetails.name',
                        kits: {
                            $arrayElemAt: ['$kitDetails', 0]  // Get the first element from kits array
                        },
                        labs: {
                            $arrayElemAt: ['$labDetails', 0]  // Get the first element from labs array
                        },
                        created_at: 1,
                        updated_at: 1,
                        is_deleted: 1,
                    },
                },
                { $limit: 1 },
            ])
                .sort({ created_at: -1 }).exec();

            console.log(combo);
            return combo;

        } catch (error) {
            console.error(`Error finding combos with user and category: ${error.message}`);
            throw new Error(`Error finding combos with pagination: ${error.message}`);
        }
    },





    countCombos: async (query) => {
        try {
            return await Combo.countDocuments(query);
        } catch (error) {
            throw new Error(`Error counting combos: ${error.message}`);
        }
    },

    updateCombo: async (id, updateData) => {
        return await Combo.updateOne({ _id: id }, updateData);
    },

    deleteCombo: async (id) => {
        return await Combo.updateOne(
            { _id: id },
            { is_deleted: true, updated_at: new Date() },
        );
    }
}

module.exports = comboRepository;