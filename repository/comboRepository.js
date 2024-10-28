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
                        from: 'users',  // Lookup user details for each combo
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$userDetails',  // Unwind userDetails to simplify access
                        preserveNullAndEmptyArrays: true, // Handle cases with no user
                    },
                },
                {
                    $lookup: {
                        from: 'categories',  // Lookup category details
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'categoryDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$categoryDetails',  // Unwind categoryDetails
                        preserveNullAndEmptyArrays: true, // Handle cases with no category
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
                        ],
                        as: 'reviews',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        price: 1,
                        discount: 1,
                        reviews: 1,
                        category_id: '$category_id',
                        category_name: '$categoryDetails.name',
                        user_id: '$user_id',
                        user_name: '$userDetails.name',
                        items: 1,  // Assuming you want to return the items field as well
                        created_at: 1,
                        updated_at: 1,
                        is_deleted: 1,
                    },
                },
                { $limit: 1 },

            ]).exec();
            console.log(combo)
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
}

module.exports = comboRepository;