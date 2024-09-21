const jwt = require('jsonwebtoken');
const { HttpStatus } = require('../consts');
const { logger } = require('../utils');
const User = require('../models/User');

const authMiddleWare = (roles = [], isClient = false) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (isClient) {
            if (!authHeader) {
                req.user = { id: '', role: null, version: 0 };
                next();
            }
        } else {
            if (!authHeader) {
                return res.status(HttpStatus.NotFound).json({ message: 'No token, authorization denied.' });
            }
        }

        handleCheckToken(req, res, next, authHeader, roles);
    };
};

const handleCheckToken = async (req, res, next, authHeader, roles) => {
    const userSchema = User;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(HttpStatus.NotFound).json({ message: 'No token, authorization denied.' });
        }

        try {
            const userToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET || '');
            if (!req.user) {
                req.user = { id: '', role: null, version: 0 };
            }
            req.user.id = userToken.id;
            req.user.role = userToken.role;
            req.user.version = userToken.version;

            const user = await userSchema.findOne({ _id: userToken.id, is_deleted: false }).lean();
            if (!user || Number(user?.token_version?.toString() || 0) !== userToken.version) {
                return res.status(HttpStatus.Forbidden).json({ message: 'Access denied: invalid token!' });
            }

            // Check roles if provided
            if (roles && roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(HttpStatus.Forbidden).json({ message: 'Access denied: insufficient role' });
            }

            next();
        } catch (error) {
            logger.error(`[ERROR] Msg: ${token}`);
            if (error instanceof Error) {
                if (error.name === 'TokenExpiredError') {
                    res.status(HttpStatus.Forbidden).json({ message: 'Token is expired' });
                } else {
                    res.status(HttpStatus.Forbidden).json({ message: 'Token is not valid' });
                }
            } else {
                res.status(HttpStatus.InternalServerError).json({ message: 'An unknown error occurred' });
            }
        }
    }
};

module.exports = authMiddleWare;
