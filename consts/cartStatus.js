const CartStatusEnum = {
    NEW: 'new',
    WAITING_PAID: 'waiting_paid',
    CANCEL: 'cancel',
    COMPLETED: 'completed',
};

const CART_STATUS_CHANGE_PAIRS = [
    [CartStatusEnum.NEW, CartStatusEnum.WAITING_PAID],
    [CartStatusEnum.CANCEL, CartStatusEnum.WAITING_PAID],
    [CartStatusEnum.WAITING_PAID, CartStatusEnum.COMPLETED],
    [CartStatusEnum.WAITING_PAID, CartStatusEnum.CANCEL],
]

module.exports = {
    CartStatusEnum,
    CART_STATUS_CHANGE_PAIRS,
};