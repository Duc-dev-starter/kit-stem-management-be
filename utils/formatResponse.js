const formatPaginationData = (data, pageNum, pageSize, totalItems) => {
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
