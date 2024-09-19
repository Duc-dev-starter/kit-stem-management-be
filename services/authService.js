const { HttpStatus } = require("../consts");
const { default: HttpException } = require("../exception");
const { createToken } = require("../utils");
const { OAuth2Client } = require('google-auth-library');
const { userRepository } = require('../repository');
const bcryptjs = require('bcrypt');


const authService = {
    login: async (model, isGoogle) => {
        let email = model.email;
        let userLogin = model;

        // login by google
        if (isGoogle) {
            if (model.google_id) {
                const client = new OAuth2Client();
                const ticket = await client.verifyIdToken({
                    idToken: model.google_id,
                });
                const payload = ticket.getPayload();
                if (payload) {
                    userLogin.email = payload.email;
                    email = payload.email;
                }
            } else {
                throw new HttpException(
                    HttpStatus.BadRequest,
                    'Field google_id via IdToken is empty, please send google_id!',
                );
            }
        }

        // Login bằng email và password
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new HttpException(HttpStatus.BadRequest, `Your email: ${email} does not exist.`);
        }

        if (user.google_id && model.password) {
            throw new HttpException(HttpStatus.BadRequest, 'You must login using Google!');
        }

        // Normal login
        if (!isGoogle && model.password) {
            const isMatchPassword = await bcryptjs.compare(model.password, user.password);
            if (!isMatchPassword) {
                throw new HttpException(HttpStatus.BadRequest, 'Your password is not valid!');
            }
        }

        if (!user.status) {
            throw new HttpException(
                HttpStatus.Forbidden,
                `Your account has been locked. Please contact admin via email to activate!`
            );
        }

        if (user.is_deleted) {
            throw new HttpException(
                HttpStatus.Forbidden,
                `Your account has been deleted. Please contact admin via email for support!`
            );
        }

        return createToken(user);
    },
};

module.exports = authService;
