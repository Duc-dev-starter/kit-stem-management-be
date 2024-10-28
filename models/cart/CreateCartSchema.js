const mongoose = require('mongoose');

const createCartSchema = new mongoose.Schema({
    kit_id: {
        type: String,
        default: ''
    },
    lab_id: {
        type: String,
        default: ''
    },
    is_combo: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    user_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

// Hàm kiểm tra dữ liệu đầu vào
const validateCreateCart = (data) => {
    // Kiểm tra điều kiện bắt buộc cho `kit_id` hoặc `lab_id`
    if (!data.kit_id && !data.lab_id) {
        return Promise.reject(new Error('Yêu cầu truyền ít nhất một trong hai giá trị: kit_id hoặc lab_id'));
    }

    // Nếu là combo thì cả kit_id và lab_id đều phải có giá trị
    if (data.is_combo && (!data.kit_id || !data.lab_id)) {
        return Promise.reject(new Error('Combo yêu cầu cả kit_id và lab_id'));
    }

    // Nếu điều kiện thỏa mãn, thực hiện validate với Mongoose
    const instance = new mongoose.Document(data, createCartSchema);
    return instance.validate();
};

module.exports = validateCreateCart;
