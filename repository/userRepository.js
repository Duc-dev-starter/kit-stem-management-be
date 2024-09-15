const User = require('../models/userModel');

const userRepository = {
    findByEmail: async (email) => {
        return await User.findOne({ email });
    },

};

module.exports = userRepository;
