const User = require("../models/User")

const authRepository = {
    findUserById: async (userId) => {
        return await User.findById(userId).lean()
    },

    findUserByEmail: async (email) => {
        return await User.findOne({ email, is_deleted: false })
    },

    findByIdAndUpdate: async (userId) => {
        return await User.findByIdAndUpdate(userId, { $inc: { token_version: 1 } });
    }
}

module.exports = authRepository;