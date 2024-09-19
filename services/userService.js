const { OAuth2Client } = require("google-auth-library");
const { USER_ROLE } = require("../consts");
const HttpException = require("../exception");
const { isEmptyObject, hashPassword, sendMail } = require("../utils");
const { userRepository } = require('../repository')
const userService = {
    createUser: async (model, isGoogle = false, isRegister = true) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        console.log(model)
        console.log(model.role)

        let newUser = {
            ...model,
            google_id: model.google_id || '',
            description: model.description || '',
            phone_number: model.phone_number || '',
            avatar: model.avatar || '',
        };

        if (isRegister && newUser.role === USER_ROLE.MANAGER) {
            throw new HttpException(
                HttpStatus.BadRequest,
                `You can only register with the Member role!`,
            );
        }

        // create a new user by google
        if (isGoogle) {
            if (model.google_id) {
                newUser = await formatUserByGoogle(model.google_id, newUser);
            } else {
                throw new HttpException(
                    HttpStatus.BadRequest,
                    'Field google_id via IdToken is empty, please send google_id!',
                );
            }
        }

        // check email duplicates
        const existingUserByEmail = await userRepository.findByEmail(newUser.email);
        if (existingUserByEmail) {
            throw new HttpException(HttpStatus.BadRequest, `Your email: '${newUser.email}' already exists!`);
        }

        // create a new user normal
        if (!isGoogle && model.password) {
            console.log('ok')
            // handle encode password
            newUser.password = await hashPassword(model.password);
        }
        let subject = 'You create new account to our system';
        let content = `Hello, ${newUser.name}. Welcome to our system`;
        const sendMailResult = await sendMail({
            toMail: newUser.email,
            subject: subject,
            content: content,
        });

        if (!sendMailResult) {
            throw new HttpException(HttpStatus.BadRequest, `Cannot send mail for ${newUser.email}`);
        }

        const createdUser = await userRepository.createNewUser(newUser);
        if (!createdUser) {
            throw new HttpException(HttpStatus.Accepted, `Create item failed!`);
        }
        const resultUser = createdUser.toObject();
        delete resultUser.password;
        return resultUser;
    },

    formatUserByGoogle: async (google_id, newUser) => {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: google_id
        });
        const payload = ticket.getPayload();
        if (payload) {
            newUser.name = payload.name;
            newUser.email = payload.email;
            newUser.avatar = payload.picture;
            newUser.google_id = payload.sub;
        }
        return newUser;
    }
}

module.exports = userService;