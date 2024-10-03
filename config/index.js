const connectToDB = require('./db');
const redisClient = require('./redis');

module.exports = {
    connectToDB,
    redisClient
}