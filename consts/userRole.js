const UserRoleEnum = {
    ALL: 'all',
    MANAGER: 'manager',
    STAFF: 'staff',
    CUSTOMER: 'customer',
    ADMIN: 'admin'
}

const UserRole = UserRoleEnum.ADMIN | UserRoleEnum.CUSTOMER | UserRoleEnum.MANAGER | UserRoleEnum.STAFF | UserRoleEnum.ALL;

const UserArr = [
    UserRoleEnum.ALL,
    UserRoleEnum.MANAGER,
    UserRoleEnum.STAFF,
    UserRoleEnum.CUSTOMER,
    UserRoleEnum.ADMIN
];
module.exports = {
    UserRoleEnum,
    UserRole,
    UserArr
};