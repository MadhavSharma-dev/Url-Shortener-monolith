const redis = require('redis');

const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

const connectRedis = async () => {
    await client.connect();
    console.log('Redis connected successfully');
};

module.exports = { client, connectRedis };