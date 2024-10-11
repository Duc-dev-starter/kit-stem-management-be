const formatPaginationData = (data, pageNum, pageSize, totalItems) => {
    if (pageSize === 0) {
        return {
            pageData: data,
            pageInfo: {
                pageNum: 1,
                pageSize: totalItems,
                totalItems: totalItems,
                totalPages: 1,
            },
        };
    }
    return {
        pageData: data,
        pageInfo: {
            pageNum: pageNum,
            pageSize: pageSize,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
        },
    };
};

const formatResponse = (data, success = true) => {
    return {
        success,
        data,
    };
};

module.exports = {
    formatPaginationData,
    formatResponse
};
