const jwt = require('jsonwebtoken');
const getUserIdCurrent = (authHeader) => {
    if (!authHeader) {
        return '';
    }
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? '');
    return user;
};


const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0;


const isModelInvalid = (model, requiredFields) => {
    const missingFields = [];

    // Kiểm tra object có trống không
    if (!model || Object.keys(model).length === 0) {
        missingFields.push('Model data is empty');
    }

    // Kiểm tra từng trường bắt buộc trong model
    for (let field of requiredFields) {
        const value = model[field.name];

        // Kiểm tra tính hợp lệ
        if (field.required && (value === undefined || value === null || (typeof value === 'string' && !value.trim()))) {
            missingFields.push(`${field.name} is required`);
        }

        if (field.type && typeof value !== field.type) {
            missingFields.push(`${field.name} must be of type ${field.type}`);
        }

        if (field.validate && !field.validate(value)) {
            missingFields.push(`${field.name} is invalid`);
        }
    }

    return missingFields.length > 0 ? missingFields : null; // Trả về danh sách các trường thiếu
};



module.exports = {
    getUserIdCurrent,
    isEmptyObject,
    isModelInvalid,
}