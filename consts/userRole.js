const UserRoleEnum = {
    ALL: 'all',
    MANAGER: 'manager',
    STAFF: 'staff',
    CUSTOMER: 'customer',
    ADMIN: 'admin'
}

const UserRole = UserRoleEnum.ADMIN | UserRoleEnum.CUSTOMER | UserRoleEnum.MANAGER | UserRoleEnum.STAFF | UserRoleEnum.ALL;

module.exports = {
    UserRoleEnum,
    UserRole
};