const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// create token
const createToken = (user) => {
    const dataInToken = { id: user.id, role: user.role, version: user.token_version };
    const secret = process.env.JWT_TOKEN_SECRET;
    const expiresIn = 28800; // 8 hours
    if (!secret) {
        throw new Error('JWT_TOKEN_SECRET is not defined');
    }

    return {
        token: jwt.sign(dataInToken, secret, { expiresIn }),
    };
};

// create token verification
const createTokenVerifiedUser = () => {
    return {
        verification_token: crypto.randomBytes(16).toString('hex'),
        verification_token_expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    };
};

module.exports = {
    createToken,
    createTokenVerifiedUser
}