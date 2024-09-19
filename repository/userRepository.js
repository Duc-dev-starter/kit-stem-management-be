const User = require('../models/User');

const userRepository = {
    findByEmail: async (email) => {
        return await User.findOne({
            email: { $regex: new RegExp('^' + email + '$', 'i') },
            is_deleted: false
        });
    },
    createNewUser: async (user) => {
        return await User.create(user);
    }

};

module.exports = userRepository;
