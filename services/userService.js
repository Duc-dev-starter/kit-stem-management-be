const { OAuth2Client } = require("google-auth-library");
const { USER_ROLE, HttpStatus, UserRoleEnum } = require("../consts");
const HttpException = require("../exception");
const { isEmptyObject, sendMail, encodePasswordUserNormal, formatPaginationData } = require("../utils");
const { userRepository } = require('../repository');
const mongoose = require("mongoose");
const bcryptjs = require('bcrypt')
const userService = {
    createUser: async (model, isGoogle = false, isRegister = true) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        let newUser = {
            ...model,
            google_id: model.google_id || '',
            description: model.description || '',
            phone_number: model.phone_number || '',
            avatar: model.avatar || '',
            token_version: 0,
        };

        if (isRegister && newUser.role === UserRoleEnum.ADMIN) {
            throw new HttpException(
                HttpStatus.BadRequest,
                `You can only register with the Customer, Staff and Manager role!`,
            );
        }

        // create a new user by google
        if (isGoogle) {
            if (model.google_id) {
                newUser = await userService.formatUserByGoogle(model.google_id, newUser);
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
            // handle encode password
            newUser.password = await encodePasswordUserNormal(model.password);
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
    },

    getUsers: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const { searchCondition, pageInfo } = model;
        const { keyword, role, status, is_deleted } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        // Tạo điều kiện tìm kiếm từ searchCondition
        let query = {};

        if (keyword) {
            const keywordValue = keyword.toLowerCase().trim();
            query = {
                $or: [
                    { email: { $regex: keywordValue, $options: 'i' } },
                    { name: { $regex: keywordValue, $options: 'i' } },
                ],
            };
        }

        if (role && role !== UserRoleEnum.ALL) {
            query = {
                ...query,
                role: role,
            };
        }

        query = {
            ...query,
            status,
            is_deleted,
        };

        // Tính toán số lượng trang
        const totalItems = await userRepository.countUser(query);

        const users = await userRepository.findUsersWithPagination(query, pageNum, pageSize);

        return formatPaginationData(users, pageNum, pageSize, totalItems);
    },
    getUserById: async (userId, is_deletedPassword, userData) => {
        if (!mongoose.isValidObjectId(userId)) {
            throw new HttpException(HttpStatus.BadRequest, `Invalid User ID format.`);
        }
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new HttpException(HttpStatus.BadRequest, `User is not exists`)
        }

        if (is_deletedPassword) {
            delete user.password;
        }
        return user
    },
    changePassword: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }
        const userId = model.user_id;

        //check if user exits
        const user = await userService.getUserById(userId, false);

        if (user.role === UserRoleEnum.ADMIN) {
            throw new HttpException(HttpStatus.BadRequest, `Admin cannot change password.`);
        }

        if (!user.password) {
            throw new HttpException(HttpStatus.BadRequest, `User created by google cannot change password.`);
        }

        // check old_password
        if (model.old_password) {
            const isMatchPassword = await bcryptjs.compare(model.old_password, user.password);
            if (!isMatchPassword) {
                throw new HttpException(HttpStatus.BadRequest, `Your old password is not valid!`);
            }
        }

        // compare new_password vs old_password
        if (model.new_password === model.old_password) {
            throw new HttpException(HttpStatus.BadRequest, `New password and old password must not be the same!`);
        }

        // handle encode password
        const newPassword = await encodePasswordUserNormal(model.new_password);
        const updatePasswordUser = await userRepository.updatePassword(user, userId, newPassword)

        if (!updatePasswordUser) throw new HttpException(HttpStatus.BadRequest, 'Change password failed!');

        return true;

    },
    changeStatus: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, `Model data is empty`)
        }

        const userId = model.user_id;

        //check user exits
        const user = await userService.getUserById(userId)

        // check change status
        if (user.status === model.status) {
            throw new HttpException(HttpStatus.BadRequest, `User status is already ${model.status}`);
        }

        const updateUserId = await userRepository.updateStatus(userId, model.status);

        if (!updateUserId.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update user status failed!');
        }

        return true;
    },
    changeRole: async (model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        const userId = model.user_id;

        // check user exits
        const user = await userService.getUserById(userId);

        // check change role
        if (user.role === model.role) {
            throw new HttpException(HttpStatus.BadRequest, `User role is already ${model.role}`);
        }

        const updateUserId = await userRepository.updateRole(userId, model.role);

        if (!updateUserId.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update user status failed!');
        }

        return true;
    },
    updateUser: async (userId, model) => {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty');
        }

        // check user exits
        const item = await userService.getUserById(userId);

        const errorResults = [];

        if (model.dob) {
            const dobDate = new Date(model.dob);
            if (isNaN(dobDate.getTime())) {
                errorResults.push({
                    message: 'Please provide value with date type!',
                    field: 'dob',
                });
            }
        }

        // check valid
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BadRequest, '', errorResults);
        }

        const updateData = {
            name: model.name,
            description: model.description || item.description,
            phone_number: model.phone_number || item.phone_number,
            avatar: model.avatar || item.avatar,
            dob: model.dob || item.dob,
            updated_at: new Date(),
        };

        const updateUserId = await userRepository.updateUser(userId, updateData);

        if (!updateUserId.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Update user info failed!');
        }

        const updateUser = await userService.getUserById(userId);
        return updateUser;
    },
    deleteUser: async (userId) => {
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new HttpException(HttpStatus.Success, `User is not exits.`);
        }

        const updateUserId = await userRepository.deleteUser(userId);

        if (!updateUserId.acknowledged) {
            throw new HttpException(HttpStatus.BadRequest, 'Delete item failed!');
        }

        return true;
    }

}

module.exports = userService;