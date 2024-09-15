const HttpException = require("../exception");

const checkUserMatch = (userId, userInItem, title) => {
    if (userId !== userInItem) {
        throw new HttpException(HttpStatus.BadRequest, `You cannot update or delete another user's ${title}!`);
    }
};

const checkValidUrl = (url) => {
    const urlPattern = /^(http:\/\/|https:\/\/)/i;
    return urlPattern.test(url);
};

module.exports = {
    checkUserMatch,
    checkValidUrl
}