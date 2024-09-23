const itemsQuery = (query, items) => {
    for (const key in items) {
        if (items[key] || items[key] === false) {
            query = {
                ...query,
                [key]: items[key],
            };
        }
    }
    return query;
};

module.exports = itemsQuery;