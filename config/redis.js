const redis = require('redis');

const createRedisClient = () => {
    const client = redis.createClient({
        url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });


    client.on('connect', () => {
        console.log('Connected to Redis Cloud');
    });

    client.on('error', (err) => {
        console.error('Redis error: ', err);
    });

    return client;
};

const redisClient = createRedisClient();
redisClient.connect().catch(err => console.error('Failed to connect to Redis:', err));
module.exports = redisClient;