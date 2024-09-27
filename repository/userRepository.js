const { User } = require("../models");

const userRepository = {
    findByEmail: async (email) => {
        try {
            return await User.findOne({
                email: { $regex: new RegExp('^' + email + '$', 'i') },
                is_deleted: false
            });
        } catch (error) {
            console.log(error);
            return;
        }
    },
    createNewUser: async (user) => {
        try {
            return await User.create(user);
        } catch (error) {
            console.log(error);
            return;
        }
    },
    findById: async (userId) => {
        try {
            return await User.findOne({ _id: userId, is_deleted: false }).lean()
        } catch (error) {
            console.log(error);
        }
    },
    updatePassword: async (user, userId, newPassword) => {
        try {
            return await User.findByIdAndUpdate(userId,
                {
                    ...user,
                    password: newPassword,
                    updatedAt: new Date(),
                }
            ).lean()
        } catch (error) {
            console.log(error);
            return;
        }
    },
    updateStatus: async (userId, status) => {
        try {
            return await User.updateOne({ _id: userId }, { status, updatedAt: new Date() })
        } catch (error) {
            console.log(error);
            return;
        }
    },
    updateRole: async (userId, role) => {
        try {
            return await User.updateOne({ _id: userId }, { role, updatedAt: new Date() })
        } catch (error) {
            console.log(error);
        }
    },
    updateUser: async (userId, updateData) => {
        try {
            return await User.updateOne({ _id: userId }, updateData)
        } catch (error) {
            return;
        }
    },
    deleteUser: async (userId) => {
        try {
            return await User.updateOne({ _id: userId }, { is_deleted: true, updatedAt: new Date() })
        } catch (error) {
            console.log(error);
            return;
        }
    },
    countUser: async (query) => {
        try {
            return await User.find(query).countDocuments().exec();
        } catch (error) {
            console.log(error);
        }
    },
    findUsersWithPagination: async (query, pageNum, pageSize) => {
        try {
            return await User.find(query)
                .find(query)
                .sort({ updated_at: -1 })
                .select('-password')
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize)
                .exec();
        } catch (error) {
            console.log(error);
            return;
        }
    },

};

module.exports = userRepository;
