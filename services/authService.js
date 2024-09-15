const { default: HttpException } = require("../exception");


const authService = {
    login: async (email, password) => {
        const user = await userRepository.findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(HttpStatus.UNAUTHORIZED, 'Invalid email or password');
        }

        const token = createToken(user);
        return { token, user };
    },


};

module.exports = authService;
