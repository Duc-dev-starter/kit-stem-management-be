const { HttpStatus } = require("../consts");
const HttpException = require("../exception");
const { Lab, Support } = require("../models");

const supportService = {
    requestSupport: async (labId, customerId, content) => {
        const lab = await Lab.findById(labId);
        if (!lab) throw new HttpException(HttpStatus.BadRequest, 'Lab not found');

        // Find the support usage of this customer
        const supportInfo = lab.supporterDetails.find(s => s.customer_id.toString() === customerId.toString());

        // Check if the customer has reached the max support count
        if (supportInfo && supportInfo.used_support_count >= lab.max_support_count) {
            throw new HttpException(HttpStatus.Forbidden, 'Support limit reached');
        }

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


    getLabWithSupportHistory: async (staffId = null, customerId = null) => {
        // Tìm lab và populate support_histories
        const lab = await Lab.find({}).populate({
            path: 'support_histories',
            match: {
                ...(staffId && { staff_id: staffId }), // Lọc theo staff_id nếu có
                ...(customerId && { customer_id: customerId }) // Lọc theo customer_id nếu có
            }
        }).sort({ created_at: -1 });

        if (!lab) throw new HttpException(HttpStatus.BadRequest, 'Lab not found');

        return lab;
    }
    ,

    replyToSupport: async (supportId, staffId, replyContent) => {
        const support = await Support.findById(supportId);
        if (!support) throw new HttpException(HttpStatus.BadRequest, 'Support request not found');

        const lab = await Lab.findById(support.lab_id);
        console.log(staffId)
        // Ensure staff is authorized to reply
        if (!support.staff_ids.includes(staffId)) {
            throw new HttpException(HttpStatus.BadRequest, 'Staff not authorized to reply');
        }

        // Get or initialize customer's support usage details
        let supportInfo = lab.supporterDetails.find(s => s.customer_id.toString() === support.customer_id.toString());

        // Check if customer has reached max support count
        if (supportInfo && supportInfo.used_support_count >= lab.max_support_count) {
            throw new HttpException(HttpStatus.Forbidden, 'Support limit reached');
        }

        // Add reply content to the support request
        support.reply_content = replyContent;
        support.replied = true;
        support.reply_at = Date.now();
        support.replied_by = staffId;

        // Update or add customer support usage in lab document
        if (supportInfo) {
            supportInfo.used_support_count += 1;
        } else {
            lab.supporterDetails.push({ customer_id: support.customer_id, used_support_count: 1 });
        }

        await support.save(); // Save the support reply
        await lab.save(); // Save updates to the lab

        return support;
    }

}

module.exports = supportService