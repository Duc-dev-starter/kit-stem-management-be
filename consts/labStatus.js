const LabStatusEnum = {
    NEW: "new",
    ACTIVE: "active",
    POPULAR: "popular",
    INACTIVE: "inactive",
    RETURNED: "returned",
    WAITING_APPROVE: 'waiting_approve',
    APPROVE: 'approve'
};

const LabStatus = LabStatusEnum.ACTIVE | LabStatusEnum.INACTIVE | LabStatusEnum.NEW | LabStatusEnum.POPULAR | LabStatusEnum.RETURNED

const REQUIRED_COMMENT_LAB_STATUSES = [
    LabStatusEnum.INACTIVE,         // Cần comment khi chuyển sang trạng thái INACTIVE
];


const VALID_STATUS_LAB_CHANGE_PAIRS = [
    [LabStatusEnum.NEW, LabStatusEnum.WAITING_APPROVE],
    [LabStatusEnum.WAITING_APPROVE, LabStatusEnum.APPROVE],
    [LabStatusEnum.APPROVE, LabStatusEnum.ACTIVE],
    [LabStatusEnum.APPROVE, LabStatusEnum.INACTIVE],
    [LabStatusEnum.ACTIVE, LabStatusEnum.INACTIVE],
    [LabStatusEnum.INACTIVE, LabStatusEnum.ACTIVE],
];


module.exports = {
    LabStatus,
    LabStatusEnum,
    VALID_STATUS_LAB_CHANGE_PAIRS,
    REQUIRED_COMMENT_LAB_STATUSES
};