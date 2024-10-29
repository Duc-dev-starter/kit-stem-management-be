const { Cart } = require("../models")

const cartRepository = {
    findCartById: async (model, userId) => {
        return await Cart.findOne({
            product_id: model.product_id,
            user_id: userId,
            is_deleted: false,
        })
    },

    createCart: async (model) => {
        return await Cart.create(model)
    }
}

module.exports = cartRepository