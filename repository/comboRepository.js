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

    countCombos: async (query) => {
        try {
            return await Combo.countDocuments(query);
        } catch (error) {
            throw new Error(`Error counting combos: ${error.message}`);
        }
    },
}

module.exports = comboRepository;