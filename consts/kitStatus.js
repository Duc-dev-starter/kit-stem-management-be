const KitStatusEnum = {
    NEW: "new",
    IN_WAREHOUSE: "in_warehouse",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CONFIRMED_DELIVERED: "confirmed_delivered",
    ACTIVE: "active", // Kit sẵn sàng sử dụng khi đã được giao nhận thành công
    SOLD_OUT: "sold_out",
    POPULAR: "popular",
    INACTIVE: "inactive",
    RETURNED: "returned"
};


const KitStatus = KitStatusEnum.ACTIVE | KitStatusEnum.INACTIVE | KitStatusEnum.NEW | KitStatusEnum.POPULAR | KitStatusEnum.SOLD_OUT | KitStatusEnum.CONFIRMED_DELIVERED | KitStatusEnum.DELIVERED | KitStatusEnum.IN_WAREHOUSE | KitStatusEnum.SHIPPED | KitStatusEnum.RETURNED

const REQUIRED_COMMENT_STATUSES = [
    KitStatusEnum.INACTIVE,         // Cần comment khi chuyển sang trạng thái INACTIVE
    KitStatusEnum.SOLD_OUT,         // Có thể cần comment khi chuyển sang trạng thái SOLD_OUT
    KitStatusEnum.RETURNED,         // Có thể cần comment khi Kit bị trả lại
];


const VALID_STATUS_CHANGE_PAIRS = [
    [KitStatusEnum.NEW, KitStatusEnum.IN_WAREHOUSE],          // Tạo Kit, chuyển vào kho
    [KitStatusEnum.IN_WAREHOUSE, KitStatusEnum.SHIPPED],      // Từ kho, Kit được giao đi
    [KitStatusEnum.SHIPPED, KitStatusEnum.DELIVERED],         // Kit đã đến tay khách hàng
    [KitStatusEnum.DELIVERED, KitStatusEnum.CONFIRMED_DELIVERED], // Khách hàng xác nhận giao thành công
    [KitStatusEnum.CONFIRMED_DELIVERED, KitStatusEnum.ACTIVE],// Kích hoạt sử dụng sau khi giao thành công
    [KitStatusEnum.ACTIVE, KitStatusEnum.SOLD_OUT],           // Kit hết hàng sau khi kích hoạt
    [KitStatusEnum.ACTIVE, KitStatusEnum.INACTIVE],           // Kit được tạm dừng sử dụng
    [KitStatusEnum.INACTIVE, KitStatusEnum.ACTIVE],           // Kit được kích hoạt lại từ trạng thái không hoạt động
    [KitStatusEnum.DELIVERED, KitStatusEnum.RETURNED],        // Khách hàng trả lại Kit
];


module.exports = {
    KitStatus,
    KitStatusEnum,
    VALID_STATUS_CHANGE_PAIRS,
    REQUIRED_COMMENT_STATUSES
};