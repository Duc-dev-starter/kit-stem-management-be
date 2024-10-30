const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { Lab, Support } = require("../models");

const supportService = {
    requestSupport: async (labId, customerId, content) => {
        const lab = await Lab.findById(labId);
        if (!lab) throw new HttpException(HttpStatus.BadRequest, 'Lab not found');

        // Tạo yêu cầu hỗ trợ mới và lưu vào collection Support
        const newSupport = await Support.create({
            customer_id: customerId,
            staff_ids: lab.supporters, // Gán mảng staff_ids từ lab.supporters
            lab_id: labId,
            content,
            replied: false // Đánh dấu là chưa được trả lời
        });

        // Lưu yêu cầu vào support_histories
        lab.support_histories.push(newSupport._id);
        await lab.save();

        return newSupport;
    },


    getLabWithSupportHistory: async (labId, staffId = null, customerId = null) => {
        // Tìm lab và populate support_histories
        const lab = await Lab.findById(labId).populate({
            path: 'support_histories',
            match: {
                ...(staffId && { staff_id: staffId }), // Lọc theo staff_id nếu có
                ...(customerId && { customer_id: customerId }) // Lọc theo customer_id nếu có
            }
        });

        if (!lab) throw new HttpException(HttpStatus.BadRequest, 'Lab not found');

        return lab;
    }
    ,

    replyToSupport: async (supportId, staffId, replyContent) => {
        const support = await Support.findById(supportId);
        if (!support) {
            throw new HttpException(HttpStatus.BadRequest, 'Support request not found');
        }

        // Kiểm tra xem nhân viên có phải là một trong những nhân viên hỗ trợ không
        if (!support.staff_ids.includes(staffId)) {
            throw new HttpException(HttpStatus.BadRequest, 'Staff not authorized to reply');
        }

        // Thêm nội dung trả lời
        support.replyContent = replyContent;
        support.replied = true; // Đánh dấu đã được trả lời

        // Cập nhật số lần hỗ trợ đã sử dụng cho khách hàng
        const lab = await Lab.findById(support.lab_id);
        const supportInfo = lab.supporterDetails.find(s => s.customer_id.toString() === support.customer_id.toString());
        if (supportInfo) {
            supportInfo.used_support_count += 1;
        } else {
            lab.supporterDetails.push({ customer_id: support.customer_id, used_support_count: 1 });
        }

        await support.save(); // Lưu cập nhật cho yêu cầu hỗ trợ
        await lab.save(); // Lưu cập nhật cho lab

        return support;
    }

}

module.exports = supportService