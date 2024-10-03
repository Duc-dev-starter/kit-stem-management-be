const bcryptjs = require('bcrypt');
const crypto = require('crypto')

const encodePasswordUserNormal = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
};

const generateRandomPassword = (length) => {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .slice(0, length)
        .replace(/[^a-zA-Z0-9]/g, '');
}

const createCacheKey = (data) => {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

module.exports = {
    generateRandomPassword,
    encodePasswordUserNormal,
    createCacheKey
};