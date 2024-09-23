const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { createToken, sendMail, generateRandomPassword, encodePasswordUserNormal, isEmptyObject } = require("../utils");
const { OAuth2Client } = require('google-auth-library');
const { authRepository } = require('../repository');
const bcryptjs = require('bcrypt');


const authService = {
    login: async (model, isGoogle) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
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
        const user = await authRepository.findUserByEmail(email);

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

        if (!user.token_version) {
            user.token_version = 0;
        }

        return createToken(user);
    },
    getCurrentLoginUser: async (userId) => {
        const user = await authRepository.findUserById(userId);
        if (!user) {
            throw new HttpException(HttpStatus.BadRequest, 'User does not exist.');
        }
        delete user.password;
        console.log(`from get current user: ${user}`);
        return user;
    },

    forgotPassword: async (email) => {
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw new HttpException(HttpStatus.BadRequest, `User with mail: ${email} is not exists.`)
        }
        if (user.google_id) {
            throw new HttpException(
                HttpStatus.BadRequest,
                `Your account is logged in by google. Please contact google for reset password!`,
            );
        }
        // handle encode password
        const generatePassword = generateRandomPassword(10);

        // send mail with new password
        const sendMailResult = await sendMail({
            toMail: user.email,
            subject: 'Generate new password for user',
            html: `Hello, ${user.name}.<br>This is a new password for ${user.email} is:<br><strong>${generatePassword}</strong>`,
        });
        if (!sendMailResult) {
            throw new HttpException(HttpStatus.BadRequest, `Cannot send mail for ${user.email}`);
        }

        const newPassword = await encodePasswordUserNormal(generatePassword);
        user.password = newPassword;
        user.updatedAt = new Date();
        const updateUser = await user.save();
        if (!updateUser) {
            throw new HttpException(HttpStatus.BadRequest, 'Cannot update user!');
        }

        return true;
    },
    logout: async (userId) => {
        const user = authRepository.findByIdAndUpdate(userId);
        if (!user) {
            throw new HttpException(HttpStatus.BadRequest, `Cannot update user!`)
        }
        return true;
    }
};

module.exports = authService;
