const PurchaseStatusEnum = {
    NEW: 'new',
    PROCESSING: 'processing',
    DELIVERING: 'delivering',
    DELIVERED: 'delivered'
};

const PURCHASE_STATUS_CHANGE_PAIRS = [
    [PurchaseStatusEnum.NEW, PurchaseStatusEnum.PROCESSING],
    [PurchaseStatusEnum.PROCESSING, PurchaseStatusEnum.DELIVERING],
    [PurchaseStatusEnum.DELIVERING, PurchaseStatusEnum.DELIVERED],
]

module.exports = {
    PurchaseStatusEnum,
    PURCHASE_STATUS_CHANGE_PAIRS
}