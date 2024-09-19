const API_PATH = {
    // auth
    AUTH: '/api/auth',
    AUTH_GOOGLE: '/api/auth/google',
    AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
    AUTH_LOGOUT: '/api/auth/logout',

    // user
    USERS: '/api/users',
    GENERATE_USERS: '/api/users/generate',
    SEARCH_USERS: '/api/users/search',
    CREATE_USERS: '/api/users/create',
    USERS_GOOGLE: '/api/users/google',
    CHANGE_PASSWORD_USERS: '/api/users/change-password',
    CHANGE_STATUS_USERS: '/api/users/change-status',
    CHANGE_ROLE_USER: '/api/users/change-role',

    // blog
    BLOG: '/api/blog',
    SEARCH_BLOG: '/api/blog/search',

    // client
    CLIENT: '/api/client',
    COURSE_IN_CLIENT: '/api/client/course',
    SEARCH_COURSE_IN_CLIENT: '/api/client/course/search',
    SEARCH_CATEGORY_IN_CLIENT: '/api/client/category/search',
    BLOG_IN_CLIENT: '/api/client/blog',
    SEARCH_BLOG_IN_CLIENT: '/api/client/blog/search',
}

module.exports = API_PATH;