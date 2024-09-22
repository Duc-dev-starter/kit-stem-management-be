const { User } = require("../models");

const userRepository = {
    findByEmail: async (email) => {
        return await User.findOne({
            email: { $regex: new RegExp('^' + email + '$', 'i') },
            is_deleted: false
        });
    },
    createNewUser: async (user) => {
        return await User.create(user);
    },
    findById: async (userId) => {
        return await User.findOne({ _id: userId, is_deleted: false }).lean()
    },
    updatePassword: async (user, userId, newPassword) => {
        return await User.findByIdAndUpdate(userId,
            {
                ...user,
                password: newPassword,
                updatedAt: new Date(),
            }
        ).lean()
    },
    updateStatus: async (userId, status) => {
        return await User.updateOne({ _id: userId }, { status, updatedAt: new Date() })
    },
    updateRole: async (userId, role) => {
        return await User.updateOne({ _id: userId }, { role, updatedAt: new Date() })
    },
    updateUser: async (userId, updateData) => {
        return await User.updateOne({ _id: userId }, updateData)
    },
    deleteUser: async (userId) => {
        return await User.updateOne({ _id: userId }, { is_deleted: true, updatedAt: new Date() })
    },
    countUser: async (query) => {
        return await User.countDocuments(query).exec();
    },
    findUsersWithPagination: async (query, pageNum, pageSize) => {
        return await User.find(query)
            .find(query)
            .sort({ updated_at: -1 })
            .select('-password')
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .exec();
    },

};

module.exports = userRepository;
